/**
 * ============================================================
 *  EDOS CLOTHING & DESIGN — SITE SETTINGS
 *  Everything the owner is likely to change lives in this file.
 * ============================================================
 */
export const site = {
  name: "Edos Clothing & Design",
  shortName: "Edos",
  tagline: "African Heritage. Tailored to Perfection.",

  // WhatsApp number for orders — digits only, with country code, no "+" or spaces.
  // All orders (cart checkout, custom sewing, contact form) are sent to this number.
  whatsappNumber: "23276123456",

  phoneDisplay: "+232 76 123456",
  email: "info@edosclothing.com",
  address: "12 Cotton Tree Street, Freetown, Sierra Leone",
  hours: "Mon – Sat: 9:00 AM – 6:00 PM",

  // Social profiles — replace the handles/URLs with the real ones.
  socials: {
    facebook: { handle: "@edosclothing", url: "https://facebook.com/edosclothing" },
    instagram: { handle: "@edosclothing", url: "https://instagram.com/edosclothing" },
    whatsapp: { handle: "+232 76 123456", url: "https://wa.me/23276123456" },
    tiktok: { handle: "@edosclothing", url: "https://tiktok.com/@edosclothing" },
    x: { handle: "@edosclothing", url: "https://x.com/edosclothing" },
  },

  // Every product has its OWN dollar price and its OWN Leones price, set by the
  // admin. This rate is only used by the admin panel's optional "suggest Leones
  // price" button — update it when the exchange rate changes.
  suggestedLeonesPerDollar: 22.5,

  // Optional: paste a form endpoint (Formspree, Getform, etc.) to collect
  // newsletter sign-ups. If empty, sign-ups open a pre-filled email instead.
  newsletterEndpoint: "",

  paymentMethods: ["Visa", "Mastercard", "PayPal", "Orange Money", "Afrimoney", "Zeepay"],
};

export type SocialKey = keyof typeof site.socials;
