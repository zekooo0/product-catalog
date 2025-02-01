import { API_BASE_URL } from "@/lib/config";
import { Product } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
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

  const filters = new URLSearchParams({
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedLetter && { letter: selectedLetter }),
    ...(search && { search }),
  }).toString();

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
    setSelectedCategory,
    setSelectedLetter,
  };
}
