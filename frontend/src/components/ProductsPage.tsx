"use client";

import Header from "@/components/Header";
import Products from "@/components/Products";
import Sidebar from "@/components/Sidebar";
import { useProducts } from "@/hooks/useProducts";
import { useEffect } from "react";

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

  useEffect(() => {
    // define a custom handler function
    // for the contextmenu event
    const handleContextMenu = (e: MouseEvent) => {
      // prevent the right-click menu from appearing
      e.preventDefault();
    };

    // attach the event listener to
    // the document object
    document.addEventListener("contextmenu", handleContextMenu);

    // clean up the event listener when
    // the component unmounts
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <Header
        selectedLetter={filters.selectedLetter}
        setSelectedLetter={setSelectedLetter}
        selectedCategory={filters.selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="flex w-full flex-1 overflow-hidden">
        <Sidebar
          selectedCategory={filters.selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <div className="flex-1 overflow-y-auto">
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
