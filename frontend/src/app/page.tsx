import ProductsPage from "@/components/ProductsPage";
import LoadingState from "@/components/LoadingState";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProductsPage />
    </Suspense>
  );
}
