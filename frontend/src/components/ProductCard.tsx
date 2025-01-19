import React from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { productsApi } from "@/lib/api";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import EditProductCard from "./EditProductCard";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  mutateProducts: () => void;
}

const ProductImage = ({
  url,
  imageURL,
  domainName,
}: {
  url: string;
  imageURL: string;
  domainName: string;
}) => (
  <div className="relative h-[200px] w-full border-b">
    <a target="_blank" rel="noopener noreferrer" href={url}>
      <Image
        src={imageURL}
        alt={domainName}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </a>
  </div>
);

const ProductHeader = ({
  url,
  domainName,
  rating,
}: {
  url: string;
  domainName: string;
  rating: number;
}) => (
  <div className="flex items-start justify-between px-4">
    <h3 className="font-semibold text-xl">
      <a target="_blank" rel="noopener noreferrer" href={url}>
        {domainName}
      </a>
    </h3>
    <div className="flex items-center gap-1">
      <span className="font-bold text-lg">{rating}</span>
      <span className="text-lg">/10</span>
    </div>
  </div>
);

const ProductCategories = ({ categories }: { categories: string[] }) => {
  const MAX_VISIBLE_CATEGORIES = 3;
  const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const remainingCount = categories.length - MAX_VISIBLE_CATEGORIES;

  return (
    <div className="flex flex-wrap gap-2 px-4">
      {visibleCategories.map((category, index) => (
        <Badge
          key={`visible-category-${category}-${index}`}
          variant="secondary"
        >
          {category}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-help">
                +{remainingCount} more
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="flex flex-wrap gap-2 max-w-xs">
              {categories
                .slice(MAX_VISIBLE_CATEGORIES)
                .map((category, index) => (
                  <Badge
                    key={`tooltip-category-${category}-${index}`}
                    variant="secondary"
                  >
                    {category}
                  </Badge>
                ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

const ProductReviewers = ({
  reviewers,
}: {
  reviewers: Array<{ name: string; url: string }>;
}) => {
  const MAX_VISIBLE_REVIEWERS = 2;
  const visibleReviewers = reviewers.slice(0, MAX_VISIBLE_REVIEWERS);
  const remainingCount = reviewers.length - MAX_VISIBLE_REVIEWERS;

  return (
    <div className="flex items-center gap-1 text-sm">
      <span>Reviewed by:</span>
      {visibleReviewers.map((reviewer, index) => (
        <React.Fragment key={`visible-reviewer-${reviewer.name}-${index}`}>
          <a
            className="text-primary hover:underline font-bold"
            href={reviewer.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {reviewer.name}
          </a>
          {index < visibleReviewers.length - 1 && <span>,</span>}
        </React.Fragment>
      ))}
      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-primary font-bold cursor-help">
                {" "}
                and {remainingCount} more
              </span>
            </TooltipTrigger>
            <TooltipContent className="flex flex-col gap-1">
              {reviewers.slice(MAX_VISIBLE_REVIEWERS).map((reviewer, index) => (
                <a
                  key={`tooltip-reviewer-${reviewer.name}-${index}`}
                  className=" hover:underline"
                  href={reviewer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {reviewer.name}
                </a>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

const DeleteProductDialog = ({
  onDelete,
}: {
  onDelete: () => Promise<void>;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button className="flex items-center gap-2 text-red-500">
        <Trash2 size={16} /> Delete
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the product
          and remove the data from the server.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const ProductCard = ({ product, mutateProducts }: ProductCardProps) => {
  const { isAuthenticated } = useAuth();

  const handleDelete = async () => {
    const token = window.localStorage.getItem("authToken");
    if (!token) return;
    await productsApi.deleteProduct(token, product._id as string);
    mutateProducts();
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between">
      <ProductImage
        url={product.url}
        imageURL={product.imageURL}
        domainName={product.domainName}
      />

      <div className=" flex flex-col justify-between flex-1 py-4 space-y-2">
        <ProductHeader
          url={product.url}
          domainName={product.domainName}
          rating={product.rating}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-muted-foreground line-clamp-2 px-4 cursor-help">
                {product.description}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">{product.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ProductCategories categories={product.categories} />
      </div>

      <div className="bg-muted p-4 flex justify-between items-center">
        <ProductReviewers reviewers={product.reviewers} />

        {isAuthenticated && (
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full p-1 hover:bg-accent">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <div className="flex flex-col gap-2">
                  <EditProductCard
                    product={product}
                    mutateProducts={mutateProducts}
                  />
                  <Separator />
                  <DeleteProductDialog onDelete={handleDelete} />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
