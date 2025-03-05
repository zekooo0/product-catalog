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
  freeTrail,
}: {
  url: string;
  imageURL: string;
  domainName: string;
  freeTrail: boolean;
}) => (
  <div className="relative h-[200px] w-full border-b ">
    <a target="_blank" href={url}>
      {imageURL && imageURL.trim() !== "" ? (
        <Image
          src={imageURL}
          alt={domainName}
          fill
          className="object-cover bg-blend-multiply"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-500">No image available</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </a>
    {freeTrail && <Badge className="absolute top-2 right-2">Free Trail</Badge>}
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
    <a target="_blank" href={url}>
      <h2 className="scroll-m-20 text-xl font-bold tracking-tight">
        {domainName}
      </h2>
    </a>
    <div className="flex items-center gap-1">
      <span className="font-bold text-lg">{starIcon}</span>
      <span className="text-lg">
        <span className="font-bold">{rating}</span>/10
      </span>
    </div>
  </div>
);

const ProductKeywords = ({ keywords }: { keywords: string[] }) => {
  const MAX_VISIBLE_KEYWORDS = 3;
  const visibleKeywords = keywords.slice(0, MAX_VISIBLE_KEYWORDS);
  const remainingCount = keywords.length - MAX_VISIBLE_KEYWORDS;

  return (
    <div className="flex flex-wrap gap-2 px-4">
      {visibleKeywords.map((keyword, index) => (
        <Badge key={`visible-keyword-${keyword}-${index}`} variant="secondary">
          {keyword}
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
              {keywords.slice(MAX_VISIBLE_KEYWORDS).map((keyword, index) => (
                <Badge
                  key={`tooltip-keyword-${keyword}-${index}`}
                  variant="secondary"
                >
                  {keyword}
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
        freeTrail={product.freeTrialAvailable === true}
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

        <ProductKeywords keywords={product.keywords} />
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

const starIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
  >
    <g fill="none">
      <path
        fill="url(#fluentColorStar160)"
        d="M7.194 2.102a.9.9 0 0 1 1.614 0l1.521 3.082l3.401.494a.9.9 0 0 1 .5 1.535l-2.462 2.4l.581 3.387a.9.9 0 0 1-1.306.948L8.001 12.35l-3.042 1.6A.9.9 0 0 1 3.653 13l.58-3.387l-2.46-2.399a.9.9 0 0 1 .499-1.535l3.4-.494z"
      />
      <defs>
        <linearGradient
          id="fluentColorStar160"
          x1="14.5"
          x2="1.125"
          y1="14.332"
          y2="1.72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff6f47" />
          <stop offset="1" stopColor="#ffcd0f" />
        </linearGradient>
      </defs>
    </g>
  </svg>
);
