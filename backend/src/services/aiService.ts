import Anthropic from '@anthropic-ai/sdk';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const MODEL = 'claude-sonnet-4-6';

export async function generateBlogPost(opts: {
  topic: string;
  tone?: string;
  keywords?: string[];
  studioName?: string;
}) {
  if (!client) throw new Error('ANTHROPIC_API_KEY not configured');
  const { topic, tone = 'warm and inspiring', keywords = [], studioName = 'our studio' } = opts;

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system:
      'You are a yoga blog writer for a studio. Produce SEO-friendly, authentic, helpful posts. ' +
      'Return JSON: { "title": string, "excerpt": string, "content": markdown, "tags": string[] }.',
    messages: [
      {
        role: 'user',
        content: `Write a blog post for ${studioName} on the topic: "${topic}".
Tone: ${tone}.
Keywords to weave in naturally: ${keywords.join(', ') || 'none'}.
Aim for 600-900 words. Use markdown headings.`,
      },
    ],
  });

  const text = msg.content
    .filter((b) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n');

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI response did not contain JSON');
  return JSON.parse(jsonMatch[0]) as {
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
  };
}

export async function chatbotAnswer(opts: { question: string; context?: string }) {
  if (!client) throw new Error('ANTHROPIC_API_KEY not configured');
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system:
      'You are a friendly, knowledgeable yoga assistant. Answer student questions on poses, ' +
      'breathwork, philosophy, schedules, and basic injury awareness. Recommend consulting a ' +
      'teacher or doctor when appropriate. Keep answers concise and warm.',
    messages: [
      {
        role: 'user',
        content: opts.context
          ? `Context:\n${opts.context}\n\nQuestion: ${opts.question}`
          : opts.question,
      },
    ],
  });
  return msg.content
    .filter((b) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n');
}

export async function generateSocialCaption(opts: { topic: string; hashtags?: number }) {
  if (!client) throw new Error('ANTHROPIC_API_KEY not configured');
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Write a punchy Instagram caption for a yoga reel about "${opts.topic}". ` +
          `Include ${opts.hashtags ?? 8} relevant hashtags at the end. Keep it under 200 characters before hashtags.`,
      },
    ],
  });
  return msg.content
    .filter((b) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n');
}
