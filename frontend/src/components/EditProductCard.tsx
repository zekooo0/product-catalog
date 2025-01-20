"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Pencil, X } from "lucide-react";
import { useState, useEffect } from "react";
import { productsApi } from "@/lib/api";
import { Product } from "@/lib/types";

type Reviewer = {
  name: string;
  url: string;
};

const productSchema = z.object({
  imageUrl: z.string().url("Please enter a valid URL"),
  domainName: z.string(),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rating: z.number().min(1).max(10),
  freeTrial: z.boolean(),
  reviewers: z.array(
    z.object({
      name: z.string(),
      url: z.string().url("Please enter a valid URL"),
    })
  ),
  keywords: z.array(z.string()),
  categories: z.array(z.string()),
});

type ProductFormValues = z.infer<typeof productSchema>;

const EditProductCard = ({
  product,
  mutateProducts,
}: {
  product: Product;
  mutateProducts: () => void;
}) => {
  const [keywordInput, setKeywordInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [reviewerInput, setReviewerInput] = useState<Reviewer>({
    name: "",
    url: "",
  });
  const [open, setOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      imageUrl: product.imageURL,
      domainName: product.domainName,
      url: product.url,
      description: product.description,
      rating: product.rating,
      freeTrial: product.freeTrialAvailable,
      reviewers: product.reviewers,
      keywords: product.keywords,
      categories: product.categories,
    },
  });

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const newKeywords = keywordInput.includes(",")
        ? keywordInput
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0)
        : [keywordInput.trim()];

      form.setValue("keywords", [
        ...form.getValues("keywords"),
        ...newKeywords,
      ]);
      setKeywordInput("");
    }
  };

  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      const newCategories = categoryInput.includes(",")
        ? categoryInput
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c.length > 0)
        : [categoryInput.trim()];

      form.setValue("categories", [
        ...form.getValues("categories"),
        ...newCategories,
      ]);
      setCategoryInput("");
    }
  };

  const handleAddReviewer = () => {
    if (reviewerInput.name.trim() && reviewerInput.url.trim()) {
      const currentReviewers = form.getValues("reviewers");
      form.setValue("reviewers", [
        ...currentReviewers,
        { name: reviewerInput.name.trim(), url: reviewerInput.url.trim() },
      ]);
      setReviewerInput({ name: "", url: "" });
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const currentKeywords = form.getValues("keywords");
    form.setValue(
      "keywords",
      currentKeywords.filter((_, i) => i !== index)
    );
  };

  const handleRemoveCategory = (index: number) => {
    const currentCategories = form.getValues("categories");
    form.setValue(
      "categories",
      currentCategories.filter((_, i) => i !== index)
    );
  };

  const handleRemoveReviewer = (index: number) => {
    const currentReviewers = form.getValues("reviewers");
    console.log(currentReviewers, index);
    form.setValue(
      "reviewers",
      currentReviewers.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: ProductFormValues) => {
    const token = window.localStorage.getItem("authToken") ?? "";
    const transformedData = {
      ...data,
      domainName: data.url.split("/")[2],
      imageURL: data.imageUrl,
      freeTrialAvailable: data.freeTrial,
      categories: data.categories,
    };
    await productsApi.updateProduct(
      token,
      product._id as string,
      transformedData
    );
    form.reset();
    mutateProducts();
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        imageUrl: product.imageURL,
        domainName: product.domainName,
        url: product.url,
        description: product.description,
        rating: product.rating,
        freeTrial: product.freeTrialAvailable,
        reviewers: product.reviewers,
        keywords: product.keywords,
        categories: product.categories,
      });
    }
  }, [open, product, form]);

  // Extract domain name from URL
  const extractDomainName = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Pencil size={16} /> Edit Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to edit a product in the catalog.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image URL</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        className="mb-2"
                      />
                      {field.value &&
                        z.string().url().safeParse(field.value).success && (
                          <Image
                            src={field.value}
                            alt="Preview"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-auto"
                          />
                        )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-fill domain name when URL changes
                        const domainName = extractDomainName(e.target.value);
                        if (domainName) {
                          form.setValue("domainName", domainName);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be auto-filled from the URL but can be edited if needed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="freeTrial"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Free Trial Available</FormLabel>
                    <FormDescription>
                      Check if a free trial is available for this product
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewers</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Reviewer Name"
                        className="flex-1"
                        value={reviewerInput.name}
                        onChange={(e) =>
                          setReviewerInput({
                            ...reviewerInput,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Reviewer URL"
                        className="flex-1"
                        value={reviewerInput.url}
                        onChange={(e) =>
                          setReviewerInput({
                            ...reviewerInput,
                            url: e.target.value,
                          })
                        }
                      />
                      <Button type="button" onClick={handleAddReviewer}>
                        Add
                      </Button>
                    </div>
                  </FormControl>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {field.value.map((reviewer, index) => (
                      <Badge key={index} variant="secondary" className="gap-2">
                        {reviewer.name}
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => handleRemoveReviewer(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add single keyword or comma-separated list"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddKeyword();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddKeyword}>
                          Add
                        </Button>
                      </div>
                      <FormDescription>
                        Press Enter to add. You can add one keyword at a time or
                        multiple keywords separated by commas.
                      </FormDescription>
                    </div>
                  </FormControl>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {field.value.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="gap-2">
                        {keyword}
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => handleRemoveKeyword(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add single category or comma-separated list"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCategory();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddCategory}>
                          Add
                        </Button>
                      </div>
                      <FormDescription>
                        Press Enter to add. You can add one category at a time
                        or multiple categories separated by commas.
                      </FormDescription>
                    </div>
                  </FormControl>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {field.value.map((category, index) => (
                      <Badge key={index} variant="secondary" className="gap-2">
                        {category}
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => handleRemoveCategory(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save Product</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductCard;
