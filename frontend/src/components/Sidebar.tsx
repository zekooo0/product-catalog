import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const Sidebar = ({
  categories,
  categoriesLoading,
  categoriesError,
  selectedCategory,
  onCategorySelect,
}: {
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: Error | null;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}) => {
  if (categoriesLoading) {
    return <div className="p-5">Loading...</div>;
  }

  if (categoriesError) {
    return <div className="p-5 text-red-500">Error loading data</div>;
  }

  return (
    <div className="p-5 min-w-[200px] border-r">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        {selectedCategory && (
          <button
            onClick={() => onCategorySelect(null)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Clear
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {categories?.map((category) => (
          <li
            key={category._id}
            onClick={() => onCategorySelect(category.name)}
            className={cn(
              "cursor-pointer py-2 px-3 rounded-md transition-colors",
              selectedCategory === category.name
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            )}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
