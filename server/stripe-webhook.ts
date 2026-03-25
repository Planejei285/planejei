import { Request, Response } from 'express';
import Stripe from 'stripe';
import { updateSubscription } from './db';

export async function handleStripeWebhook(req: Request, res: Response) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error('[Webhook] Signature verification failed:', error);
    return res.status(400).send(`Webhook Error: ${error}`);
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected, returning verification response');
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = parseInt(session.client_reference_id || '0');
        const plan = (session.metadata?.plan || 'free') as 'free' | 'basic' | 'premium';

        if (userId && session.subscription) {
          await updateSubscription(userId, {
            plan,
            status: 'active',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          });

          console.log(`[Webhook] Subscription created for user ${userId}: ${plan}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const metadata = subscription.metadata || {};
        const userId = parseInt(metadata.user_id || '0');

        if (userId) {
          const status = subscription.status === 'active' ? 'active' : 'canceled';
          const updates: any = {
            status: status as 'active' | 'canceled' | 'expired',
          };
          
          if (subscription.current_period_start) {
            updates.currentPeriodStart = new Date(subscription.current_period_start * 1000);
          }
          if (subscription.current_period_end) {
            updates.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          }
          
          await updateSubscription(userId, updates);

          console.log(`[Webhook] Subscription updated for user ${userId}: ${status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const metadata = subscription.metadata || {};
        const userId = parseInt(metadata.user_id || '0');

        if (userId) {
          await updateSubscription(userId, {
            status: 'canceled',
            plan: 'free',
            canceledAt: new Date(),
          });

          console.log(`[Webhook] Subscription canceled for user ${userId}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Payment succeeded for invoice ${invoice.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Payment failed for invoice ${invoice.id}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing event:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
