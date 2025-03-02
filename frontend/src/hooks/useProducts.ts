import { API_BASE_URL } from "@/lib/config";
import { Product } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import useSWR from "swr";

interface UseProductsOptions {
  initialCategory?: string;
  initialLetter?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    options.initialCategory ?? null
  );
  const [selectedLetter, setSelectedLetter] = useState<string>(
    options.initialLetter ?? ""
  );

  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  // Reset category and letter when search is active
  useEffect(() => {
    if (search) {
      setSelectedCategory(null);
      setSelectedLetter("");
    }
  }, [search]);

  // Create custom setter functions that reset other filters
  const setSelectedCategoryAndResetOthers = (category: string | null) => {
    setSelectedCategory(category);
    // Only reset search if there's an actual category selected
    if (category) {
      // We can't directly manipulate searchParams, but we'll handle this in the Search component
    }
  };

  const setSelectedLetterAndResetOthers = (letter: string) => {
    setSelectedLetter(letter);
    // Only reset other filters if there's an actual letter selected
    if (letter) {
      setSelectedCategory(null);
      // We can't directly manipulate searchParams, but we'll handle this in the Search component
    }
  };

  // Only include one filter at a time based on priority: search > letter > category
  let activeFilter = {};
  if (search) {
    activeFilter = { search };
  } else if (selectedLetter) {
    activeFilter = { letter: selectedLetter.toLowerCase() };
  } else if (selectedCategory) {
    activeFilter = { category: selectedCategory };
  }

  const filters = new URLSearchParams(activeFilter).toString();
  
  const apiUrl = `${API_BASE_URL}/products${filters ? `?${filters}` : ""}`;

  const {
    data: products,
    error,
    isLoading,
    mutate,
  } = useSWR<Product[]>(apiUrl, fetcher);

  return {
    products: products ?? [],
    error,
    isLoading,
    mutate,
    filters: {
      selectedCategory,
      selectedLetter,
      search,
    },
    setSelectedCategory: setSelectedCategoryAndResetOthers,
    setSelectedLetter: setSelectedLetterAndResetOthers,
  };
}
