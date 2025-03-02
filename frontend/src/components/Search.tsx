import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useQueryState } from "nuqs";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchProps {
  setSelectedLetter: (letter: string) => void;
  selectedCategory: string | null;
  selectedLetter: string;
}

const Search = ({ setSelectedLetter, selectedCategory, selectedLetter }: SearchProps) => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });
  const [inputValue, setInputValue] = useState(search);
  const debouncedValue = useDebounce(inputValue, 400); // 400ms debounce delay

  // Update the URL query param when the debounced value changes
  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  // Reset search when category or letter is selected
  useEffect(() => {
    if (selectedCategory || selectedLetter) {
      setInputValue("");
      setSearch("");
    }
  }, [selectedCategory, selectedLetter, setSearch]);

  return (
    <div className="w-full lg:w-[600px] mx-auto flex items-center gap-1 rounded-md border border-input px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
      <SearchIcon className="text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by keywords..."
        className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="Search products"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setSelectedLetter(""); // Clear the selected letter when typing
        }}
      />
    </div>
  );
};

export default Search;
