"use client";

import { useAuth } from "@/contexts/auth-context";
import AddProductCard from "./AddProductCard";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";
import LoadingSpinner from "./LoadingSpinner";

const Products = ({
  products,
  productsLoading,
  productsError,
  mutateProducts,
}: {
  products: Product[];
  productsLoading: boolean;
  productsError: Error | null;
  mutateProducts: () => void;
}) => {
  const { isAuthenticated } = useAuth();

  // Handle loading states
  if (productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle errors
  if (productsError) {
    return <div className="p-5 text-red-500">Error loading data</div>;
  }
  if (products.length == 0) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        No products found
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center px-5">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-5">
          Tool
        </h3>
        {isAuthenticated && <AddProductCard mutateProducts={mutateProducts} />}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 px-5">
        {products
          ?.sort((a, b) => b.rating - a.rating)
          ?.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              mutateProducts={mutateProducts}
            />
          ))}
      </div>
    </div>
  );
};

export default Products;
