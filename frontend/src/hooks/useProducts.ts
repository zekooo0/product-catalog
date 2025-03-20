import { API_BASE_URL } from "@/lib/config";
import { Product } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
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

  // Memoize the filters creation to prevent unnecessary API calls
  const filtersString = useMemo(() => {
    const params = new URLSearchParams({
      ...(selectedCategory && { category: selectedCategory }),
      ...(selectedLetter && { letter: selectedLetter }),
      ...(search && { search }),
    }).toString();
    return params;
  }, [selectedCategory, selectedLetter, search]);

  const apiUrl = `${API_BASE_URL}/products${filtersString ? `?${filtersString}` : ""}`;

  const {
    data: products,
    error,
    isLoading,
    mutate,
  } = useSWR<Product[]>(
    apiUrl, 
    fetcher, 
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 10000, // 10 seconds
      errorRetryCount: 3,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry on network errors and 5xx errors
        if (error.status >= 400 && error.status < 500) return;
        
        // Exponential backoff
        const delay = Math.min(1000 * 2 ** retryCount, 30000);
        setTimeout(() => revalidate({ retryCount }), delay);
      },
    }
  );

  // Memoize callbacks
  const setCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const setLetter = useCallback((letter: string) => {
    setSelectedLetter(letter);
  }, []);

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
    setSelectedCategory: setCategory,
    setSelectedLetter: setLetter,
  };
}
