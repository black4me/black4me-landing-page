<div align="center">
<h1>Black4Me E-commerce Platform</h1>
</div>

# Run and deploy your Next.js App

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js (18+), npm

1. Install dependencies:
   `npm install`

2. Set the environment variables in `.env.local`. Ensure the following keys are provided:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `PAYPAL_SECRET`
   - `RESEND_API_KEY`
   - `ADMIN_EMAILS` (Comma-separated list of admin emails for dashboard access)
   - `NEXT_PUBLIC_SITE_URL`

3. Run the app:
   `npm run dev`

## Deployment

This app is designed to be deployed on **Vercel**.
Ensure that all environment variables listed above are added to the Vercel project settings.

## Security Audit Notes

*   **Idempotency:** Webhook handlers (Stripe/PayPal) are protected against duplicate events via order ID tracking.
*   **Authorization:** Admin access is restricted via the `ADMIN_EMAILS` environment variable.
*   **Dependency Audit:** Be mindful of `xlsx` package usage on the frontend/backend as the original NPM package (`0.18.5`) has known vulnerabilities without active upstream patches on the NPM registry. Use cautiously for internal tooling only.
