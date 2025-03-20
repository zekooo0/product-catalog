import ProductsPage from "@/components/ProductsPage";
import LoadingState from "@/components/LoadingState";
import FirstTimeModal from "@/components/FirstTimeModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { Metadata } from "next";
import { APP_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: APP_CONFIG.APP_NAME,
  description: APP_CONFIG.APP_DESCRIPTION,
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <FirstTimeModal />
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<LoadingState />}>
          <ProductsPage />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        We're having trouble loading your products. Please try again later.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Retry
      </button>
    </div>
  );
}
