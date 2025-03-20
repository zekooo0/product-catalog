# Product Catalog Frontend

A Next.js application for managing product catalogs efficiently.

## Getting Started

First, set up your environment variables:

```bash
# Copy the example env file and modify as needed
cp .env.local.example .env.local
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The application requires the following environment variables:

- `NEXT_PUBLIC_API_URL` - API endpoint URL (required)
- `NEXT_PUBLIC_FEATURE_NEW_UI` - Feature flag for new UI (optional, defaults to false)

These can be set in a `.env.local` file at the root of the project.

## Project Structure

```
frontend/
├── public/        # Static assets
├── src/
│   ├── app/       # Next.js app directory (pages, layouts)
│   ├── components/# React components
│   ├── contexts/  # React contexts for state management
│   ├── hooks/     # Custom React hooks
│   └── lib/       # Utility functions, types, and configuration
└── ...            # Configuration files
```

## Main Features

- Product catalog management
- Product categorization
- Search and filtering
- Responsive design with dark/light mode support
- Error handling and logging

## Error Handling

The application includes a comprehensive error handling system:

- `ErrorBoundary` component for catching React errors
- `ErrorService` for centralized error logging and formatting
- User-friendly error messages

## API Integration

The application connects to a backend API for data retrieval and manipulation:

- Uses SWR for data fetching with caching
- Includes retry logic and error handling
- Environment-based API configuration

## Deployment

The application is configured for deployment on Vercel. The production environment
variables must be set in the Vercel dashboard.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
