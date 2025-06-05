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
import { X } from "lucide-react";
import { useState } from "react";
import { productsApi } from "@/lib/api";
import { ErrorService } from "@/lib/error-service";
import LoadingSpinner from "./LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

type Reviewer = {
  name: string;
  url: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

const productSchema = z.object({
  imageUrl: z.string().optional(),
  imageFile: z.any().optional(),
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

const AddProductCard = ({ mutateProducts }: { mutateProducts: () => void }) => {
  const [keywordInput, setKeywordInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [reviewerInput, setReviewerInput] = useState<Reviewer>({
    name: "",
    url: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      imageUrl: "",
      imageFile: null,
      domainName: "",
      url: "",
      description: "",
      rating: 1,
      freeTrial: false,
      reviewers: [],
      keywords: [],
      categories: [],
    },
  });

  const handleAddKeywords = () => {
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

  const handleAddCategories = () => {
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
    form.setValue(
      "reviewers",
      currentReviewers.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitStatus("loading");
    const token = window.localStorage.getItem("authToken") ?? "";

    try {
      // Trim all string values
      const trimmedData = {
        ...data,
        imageUrl: data.imageUrl?.trim() || "",
        domainName: data.domainName.trim().replace(/^www\./, ""),
        url: data.url.trim(),
        description: data.description.trim(),
        // Trim nested array objects
        reviewers: data.reviewers.map(reviewer => ({
          name: reviewer.name.trim(),
          url: reviewer.url.trim()
        })),
        keywords: data.keywords.map(keyword => keyword.trim()),
        categories: data.categories.map(category => category.trim())
      };

      // Create FormData if we have a file
      if (selectedFile) {
        const formData = new FormData();

        // Add basic string fields
        formData.append("url", trimmedData.url);
        formData.append("domainName", trimmedData.domainName);
        formData.append("description", trimmedData.description);
        formData.append("rating", trimmedData.rating.toString());
        formData.append("freeTrial", trimmedData.freeTrial.toString());
        formData.append("reviewers", JSON.stringify(trimmedData.reviewers));
        formData.append("keywords", JSON.stringify(trimmedData.keywords));
        formData.append("categories", JSON.stringify(trimmedData.categories));

        // Add the file last
        formData.append("image", selectedFile);

        await productsApi.createProduct(token, formData);
      } else {
        // If no file, send as regular JSON
        const transformedData = {
          imageURL: selectedFile ? "" : trimmedData.imageUrl,
          domainName: trimmedData.domainName,
          url: trimmedData.url,
          description: trimmedData.description,
          rating: trimmedData.rating,
          freeTrialAvailable: trimmedData.freeTrial,
          categories: trimmedData.categories,
          reviewers: trimmedData.reviewers,
          keywords: trimmedData.keywords,
        };
        await productsApi.createProduct(token, transformedData);
      }

      // Set success state and trigger product list refresh
      setSubmitStatus("success");
      mutateProducts();

      toast({
        title: "Product added",
        description: "Product added successfully",
      });
      // Reset form after short delay to show success message
      setTimeout(() => {
        resetForm();
        setIsDialogOpen(false);
      }, 1500);
    } catch (error) {
      setSubmitStatus("error");
      ErrorService.logError(error, { context: "AddProductCard.onSubmit" });
      // Reset back to idle after displaying error briefly
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  const resetForm = () => {
    form.reset();
    setSelectedFile(null);
    setImagePreview(null);
    setKeywordInput("");
    setCategoryInput("");
    setReviewerInput({ name: "", url: "" });
    setSubmitStatus("idle");
  };

  const onClose = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  // Extract domain name from URL
  const extractDomainName = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to the catalog.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="add-product-form"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormLabel className="text-sm font-normal">
                          Option 1: Enter Image URL
                        </FormLabel>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value) {
                              setSelectedFile(null);
                              setImagePreview(null);
                            }
                          }}
                          disabled={!!selectedFile}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormLabel className="text-sm font-normal">
                          Option 2: Upload Image File
                        </FormLabel>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedFile(file);
                              field.onChange(""); // Clear URL field
                              // Create preview URL
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          disabled={!!field.value}
                        />
                      </div>

                      {/* Preview area */}
                      {(field.value || imagePreview) && (
                        <div className="mt-4">
                          <FormLabel className="text-sm font-normal">
                            Preview:
                          </FormLabel>
                          <div className="relative h-[220px] w-full mt-2 border rounded-md overflow-hidden bg-gray-50">
                            <div className="relative w-full h-full">
                              <Image
                                src={imagePreview || field.value || ""}
                                alt="Preview"
                                fill
                                className="object-cover"
                                sizes="100vw"
                              />
                            </div>
                          </div>
                        </div>
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
                  <FormLabel>Domain Name - Tool</FormLabel>
                  <FormControl>
                    <Input placeholder="example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be auto-filled from the URL but can be edited if
                    needed.
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
                              handleAddKeywords();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddKeywords}>
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
                              handleAddCategories();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddCategories}>
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
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Tool</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tool</DialogTitle>
                <DialogDescription>
                  Are you sure you want to add this tool?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="submit"
                  form="add-product-form"
                  disabled={
                    submitStatus === "loading" || submitStatus === "success"
                  }
                  className="min-w-[100px]"
                >
                  {submitStatus === "loading" && (
                    <LoadingSpinner size="sm" className="mr-2" />
                  )}
                  {submitStatus === "success"
                    ? "Tool Added!"
                    : submitStatus === "error"
                    ? "Failed"
                    : "Save Tool"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductCard;
