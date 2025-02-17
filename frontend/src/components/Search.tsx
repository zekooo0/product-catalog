import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useQueryState } from "nuqs";

interface SearchProps {
  setSelectedLetter: (letter: string) => void;
}

const Search = ({ setSelectedLetter }: SearchProps) => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });
  return (
    <div className=" w-full lg:w-[600px] mx-auto flex items-center gap-1 rounded-md border border-input px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
      <SearchIcon className="text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by keywords..."
        className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="Search products"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedLetter(""); // Clear the selected letter when typing
        }}
      />
    </div>
  );
};

export default Search;
