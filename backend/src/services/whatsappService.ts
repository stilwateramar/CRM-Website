import axios from 'axios';

const GRAPH = 'https://graph.facebook.com/v20.0';

export async function sendWhatsappText(to: string, body: string) {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!phoneId || !token) {
    console.warn('WhatsApp not configured; skipping send');
    return { skipped: true };
  }
  const { data } = await axios.post(
    `${GRAPH}/${phoneId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body },
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

/**
 * Parse a WhatsApp contacts CSV/VCF export into student records.
 * Accepts an array of { name, phone, email? } already deserialized client-side.
 */
export function normalizeImportedContacts(rows: { name?: string; phone?: string; email?: string }[]) {
  return rows
    .filter((r) => r.phone || r.email)
    .map((r) => ({
      name: r.name?.trim() || (r.phone ? `Student ${r.phone.slice(-4)}` : 'Student'),
      phone: r.phone?.replace(/\s+/g, ''),
      email: r.email?.trim().toLowerCase(),
    }));
}
