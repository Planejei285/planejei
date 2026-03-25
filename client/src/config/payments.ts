export const PAYMENT_LINKS = {
  basic:
    import.meta.env.VITE_MP_BASIC_URL ||
    "",
  premium:
    import.meta.env.VITE_MP_PREMIUM_URL ||
    "",
};

export function getPaymentLink(plan: "basic" | "premium") {
  return PAYMENT_LINKS[plan];
}
