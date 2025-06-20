"use client";

import Header from "@/components/Header";
import Products from "@/components/Products";
import Sidebar from "@/components/Sidebar";
import { useProducts } from "@/hooks/useProducts";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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

  // State for mobile sidebar visibility
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  // Close sidebar when a category is selected on mobile
  const handleMobileCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <Header
        selectedLetter={filters.selectedLetter}
        setSelectedLetter={setSelectedLetter}
        selectedCategory={filters.selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Mobile sidebar toggle button */}
      <div className="md:hidden px-4 py-2 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X /> : <Menu />}
          <span className="ml-2 sr-only">Toggle Sidebar</span>
        </Button>
        <span className="ml-3 font-medium">
          {filters.selectedCategory
            ? `Category: ${filters.selectedCategory}`
            : "All Categories"}
        </span>
      </div>

      <div className="flex w-full flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile by default, shown when isMobileSidebarOpen is true */}
        <div
          className={`${
            isMobileSidebarOpen ? "block" : "hidden"
          } md:block absolute md:relative z-30 bg-background md:bg-transparent w-full md:w-auto h-full`}
        >
          <Sidebar
            selectedCategory={filters.selectedCategory}
            onCategorySelect={handleMobileCategorySelect}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto w-full">
          <Products
            selectedCategory={filters.selectedCategory}
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
