import { cn, fetcher } from "@/lib/utils";
import useSWR from "swr";
import LoadingSpinner from "./LoadingSpinner";
import { API_BASE_URL } from "@/lib/config";
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
    <div className="sticky top-0 left-0 max-h-[70vh] p-5 min-w-[200px] border-r flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        {selectedCategory && (
          <Button
            onClick={() => onCategorySelect(null)}
            className="text-md cursor-pointer bg-gray-500 dark:bg-white px-2 py-1 rounded-md transition-colors text-blue-700 hover:text-blue-800 hover:bg-gray-100"
          >
            Clear
          </Button>
        )}
      </div>
      <ul className="space-y-2 overflow-y-auto flex-grow">
        {categories?.map((category, index) => (
          <li
            key={index}
            onClick={() => onCategorySelect(category.category)}
            className={cn(
              "cursor-pointer py-2 px-3 rounded-md transition-colors flex justify-between",
              selectedCategory === category.category
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            )}
          >
            <span>
              {category.category} ({category.count})
            </span>
            {selectedCategory === category.category && (
              <span className="text-blue-500">✓</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
