"use client";

import { useAuth } from "@/contexts/auth-context";
import AddProductCard from "./AddProductCard";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";

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
    return <div className="p-5">Loading...</div>;
  }

  // Handle errors
  if (productsError) {
    return <div className="p-5 text-red-500">Error loading data</div>;
  }
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center px-5">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-5">
          All Products
        </h3>
        {isAuthenticated && <AddProductCard mutateProducts={mutateProducts} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
        {products?.map((product) => (
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
