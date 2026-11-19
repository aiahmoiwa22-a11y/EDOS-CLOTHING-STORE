/**
 * ============================================================
 *  EDOS CLOTHING & DESIGN — SITE SETTINGS
 *  Everything the owner is likely to change lives in this file.
 * ============================================================
 */
export const site = {
  name: "Edos Clothing & Design",
  shortName: "Edo's",
  tagline: "African Heritage. Tailored to Perfection.",

  // WhatsApp number for orders — digits only, with country code, no "+" or spaces.
  // All orders (cart checkout, custom sewing, contact form) are sent to this number.
  whatsappNumber: "23278809288",

  phoneDisplay: "+232 78 809288",
  email: "eldredconteh@gmail.com",
  address: "15 Personage street, waterloo, Freetown, Sierra Leone",
  hours: "Mon – Sat: 9:00 AM – 6:00 PM",

  // Social profiles — replace the handles/URLs with the real ones.
  socials: {
    facebook: { handle: "Edo's Clothing & Design", url: "https://www.facebook.com/share/19yqrdxQru/?mibextid=wwXIfr" },
    instagram: { handle: "conteheldredalfred", url: "https://www.instagram.com/conteheldredalfred?knvt=MTkxYWVobzY1MWt6bg%3D%3D&utm_source=qr" },
    whatsapp: { handle: "+232 78 809288", url: "https://wa.me/23278809288" },
    tiktok: { handle: "eldredconteh", url: "https://www.tiktok.com/@eldredconteh?_r=1&_t=ZS-9BW5VWf3q2G" },
    x: { handle: "@edosclothing", url: "https://x.com/edosclothing" },
  },

  // Every product has its OWN dollar price and its OWN Leones price, set by the
  // admin. This rate is only used by the admin panel's optional "suggest Leones
  // price" button — update it when the exchange rate changes.
  suggestedLeonesPerDollar: 22.5,

  // Optional: paste a form endpoint (Formspree, Getform, etc.) to collect
  // newsletter sign-ups. If empty, sign-ups open a pre-filled email instead.
  newsletterEndpoint: "",

  paymentMethods: ["Visa", "Mastercard", "PayPal", "Orange Money", "Afrimoney", "Qmoney"],
};

export type SocialKey = keyof typeof site.socials;
