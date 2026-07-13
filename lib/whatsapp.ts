import { SITE } from "@/config/site";

/** Build a wa.me placeholder link (no real number wired for the demo). */
export function buildWhatsAppUrl(message: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
