This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3008](http://localhost:3008) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Inter](https://vercel.com/font).

### Run the drizzle studio:

```bash
npm run db:studio
```

If required before starting drizzle studio, run the following commands:

```bash
npm run db:generate
npm run db:migrate
```

### Stripe CLI & Webhooks:

If Stripe CLI is not installed, run the command:

```bash
brew install stripe/stripe-cli/stripe
```

Login to Stripe CLI:

```bash
stripe login
```

Get the webhook signing secret, run the command:

```bash
stripe listen --forward-to localhost:3008/api/subscriptions/webhook
```

Trigger events with CLI:

```bash
stripe trigger <event>
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
