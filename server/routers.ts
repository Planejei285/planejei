import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getOrCreateSubscription } from "./db";
import Stripe from 'stripe';
import { STRIPE_PRODUCTS } from "./stripe-products";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  subscription: router({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await getOrCreateSubscription(ctx.user.id);
      return subscription;
    }),
    
    createCheckoutSession: protectedProcedure
      .input(z.enum(['basic', 'premium']))
      .mutation(async ({ ctx, input }) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

        const plan = input;
        const product = STRIPE_PRODUCTS[plan];
        const origin = ctx.req.headers.origin || 'https://planejei.manus.space';

        try {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: product.currency,
                  product_data: {
                    name: product.name,
                    description: product.description,
                  },
                  recurring: {
                    interval: product.interval,
                    interval_count: 1,
                  },
                  unit_amount: product.price,
                },
                quantity: 1,
              },
            ],
            mode: 'subscription',
            success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/subscription/cancel`,
            customer_email: ctx.user.email || undefined,
            client_reference_id: ctx.user.id.toString(),
            metadata: {
              user_id: ctx.user.id.toString(),
              plan: plan,
              customer_email: ctx.user.email || '',
              customer_name: ctx.user.name || '',
            },
            allow_promotion_codes: true,
          });

          return {
            checkoutUrl: session.url,
          };
        } catch (error) {
          console.error('[Stripe] Failed to create checkout session:', error);
          throw new Error('Failed to create checkout session');
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
