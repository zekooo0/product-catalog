import ProductsPage from "@/components/ProductsPage";
import LoadingState from "@/components/LoadingState";
import FirstTimeModal from "@/components/FirstTimeModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <FirstTimeModal />
      <ErrorBoundary>
        <Suspense fallback={<LoadingState />}>
          <ProductsPage />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
