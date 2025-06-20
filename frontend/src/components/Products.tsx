"use client";

import { useAuth } from "@/contexts/auth-context";
import { Product } from "@/lib/types";
import AddProductCard from "./AddProductCard";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./ProductCard";

const Products = ({
  products,
  productsLoading,
  productsError,
  mutateProducts,
  selectedCategory,
}: {
  products: Product[];
  productsLoading: boolean;
  productsError: Error | null;
  mutateProducts: () => void;
  selectedCategory: string | null;
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
    <div className="flex-1 w-full pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-5">
        <h3 className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight my-3 sm:my-5">
          {selectedCategory ? selectedCategory : "Tools"}
        </h3>
        {isAuthenticated && <AddProductCard mutateProducts={mutateProducts} />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-3 sm:gap-4 px-3 sm:px-5">
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
