import { API_BASE_URL } from "@/lib/config";
import { cn, fetcher } from "@/lib/utils";
import useSWR from "swr";
import LoadingSpinner from "./LoadingSpinner";
import { Button } from "./ui/button";

const Sidebar = ({
  selectedCategory,
  onCategorySelect,
}: {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}) => {
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useSWR<{ category: string; count: number }[]>(
    `${API_BASE_URL}/products/categories`,
    fetcher
  );

  if (categoriesLoading) {
    return (
      <div className="flex justify-center w-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (categoriesError) {
    return <div className="p-5 text-red-500">Error loading data</div>;
  }

  return (
    <div className="sticky top-0 left-0 h-full md:max-h-[70vh] p-4 md:p-5 w-full md:min-w-[200px] md:max-w-[250px] md:border-r flex flex-col overflow-hidden bg-background">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Categories</h2>
        {selectedCategory && (
          <Button
            onClick={() => onCategorySelect(null)}
            size="sm"
            variant="outline"
            className="text-sm md:text-md cursor-pointer transition-colors"
          >
            Clear
          </Button>
        )}
      </div>
      <ul className="space-y-1 md:space-y-2 overflow-y-auto overflow-x-hidden flex-grow max-h-[calc(100vh-220px)] pb-20 md:pb-0">
        {categories
          ?.sort((a, b) => a.category.localeCompare(b.category))
          ?.map((category, index) => (
            <li
              key={index}
              onClick={() => onCategorySelect(category.category)}
              className={cn(
                "cursor-pointer capitalize rounded-md transition-colors flex justify-between p-2",
                selectedCategory === category.category
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 hover:text-blue-500"
              )}
            >
              <span className="text-sm md:text-base truncate max-w-[150px] md:max-w-[180px]">
                {category.category} ({category.count})
              </span>
              {selectedCategory === category.category && <span>✓</span>}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
