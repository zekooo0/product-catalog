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
import EditProductCard from "./EditProductCard";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;

  mutateProducts: () => void;
}

const ProductCard = ({ product, mutateProducts }: ProductCardProps) => {
  const { isAuthenticated } = useAuth();
  const handleDelete = async () => {
    const token = window.localStorage.getItem("authToken");

    if (!token) return;

    await productsApi.deleteProduct(token, product._id as string);
    mutateProducts();
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow hover:shadow-card hover:scale-105 transition-all duration-300">
      <div className="relative h-[200px] w-full border-b">
        <Image
          src={product.imageURL}
          alt={product.domainName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className=" space-y-3 py-2">
        <div className="flex items-start justify-between px-4">
          <h3 className="font-semibold text-xl">{product.domainName}</h3>
          <div className="flex items-center gap-1">
            <span className="font-bold text-lg">{product.rating}</span>
            <span className="text-lg">/10</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 px-4">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2 px-4">
          {product.categories.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 bg-emerald-500 p-2">
          <div className="flex items-center gap-1 text-sm text-primary-foreground">
            <span>Reviewed by:</span>
            {product.reviewers.map((r) => (
              <span key={r.name} className="text-primary">
                {r.name}
              </span>
            ))}
          </div>
          {isAuthenticated && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full p-1 hover:bg-accent">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-fit ">
                <div className="flex flex-col gap-2">
                  <EditProductCard
                    product={product}
                    mutateProducts={mutateProducts}
                  />
                  <Separator />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="flex items-center gap-2 text-red-500">
                        <Trash2 size={16} /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the product and remove the data from the
                          server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
