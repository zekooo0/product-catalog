"use client";

import Header from "@/components/Header";
import Products from "@/components/Products";
import Sidebar from "@/components/Sidebar";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const {
    products,
    error: productsError,
    isLoading: productsLoading,
    mutate: mutateProducts,
    filters,
    setSelectedCategory,
    setSelectedLetter,
  } = useProducts();

  return (
    <div className="relative">
      <Header
        selectedLetter={filters.selectedLetter}
        setSelectedLetter={setSelectedLetter}
      />
      <div className="flex w-full">
        <Sidebar
          selectedCategory={filters.selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <div className="flex-1">
          <Products
            products={products}
            productsLoading={productsLoading}
            productsError={productsError}
            mutateProducts={mutateProducts}
          />
        </div>
      </div>
    </div>
  );
}
