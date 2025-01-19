"use client";

import Header from "@/components/Header";
import Products from "@/components/Products";
import Sidebar from "@/components/Sidebar";
import { Product } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  // Construct the API URL with filters
  const apiUrl = `http://localhost:5000/api/products${
    selectedCategory || selectedLetter || search
      ? "?" +
        new URLSearchParams({
          ...(selectedCategory && { category: selectedCategory }),
          ...(selectedLetter && { letter: selectedLetter }),
          ...(search && { search }),
        }).toString()
      : ""
  }`;

  const {
    data: products,
    error: productsError,
    isLoading: productsLoading,
    mutate: mutateProducts,
  } = useSWR<Product[]>(apiUrl, fetcher);

  return (
    <div className="relative">
      <Header
        selectedLetter={selectedLetter}
        setSelectedLetter={setSelectedLetter}
      />
      <div className="flex w-full">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <div className="flex-1">
          <Products
            products={products || []}
            productsLoading={productsLoading}
            productsError={productsError}
            mutateProducts={mutateProducts}
          />
        </div>
      </div>
    </div>
  );
}
