import { z } from 'zod';

// Strict schema for Stripe Webhooks payload
export const stripeWebhookSchema = z.object({
  id: z.string().min(10).max(255),
  object: z.literal('event'),
  type: z.enum([
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    // add other types if necessary
  ]).or(z.string()), // we allow other strings but we will only process our known ones
  created: z.number().positive(),
  data: z.object({
    object: z.object({
      id: z.string().optional(),
      customer_details: z.object({
        email: z.string().email().nullable().optional(),
      }).nullable().optional(),
      metadata: z.record(z.string(), z.string()).nullable().optional(),
      amount_total: z.number().nullable().optional(),
      payment_status: z.string().optional(),
    }).passthrough(),
  }),
}).passthrough();
