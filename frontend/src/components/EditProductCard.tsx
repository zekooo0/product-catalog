"use client";

import { API_BASE_URL } from "@/lib/config";
import { Product } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

type Reviewer = {
  name: string;
  url: string;
};

const productSchema = z.object({
  imageUrl: z.union([
    z.string().url("Please enter a valid URL"),
    z.string().length(0), // Allow empty string
  ]),
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlCleared, setImageUrlCleared] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [originalData, setOriginalData] = useState<ProductFormValues | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      imageUrl: product.imageURL,
      imageFile: null,
      domainName: product.domainName,
      url: product.url,
      description: product.description,
      rating: product.rating,
      freeTrial: product.freeTrialAvailable,
      reviewers: product.reviewers,
      keywords: product.keywords,
      categories: product.categories,
    },
    mode: "onChange",
  });

  const formValues = form.watch();

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
    form.setValue(
      "reviewers",
      currentReviewers.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitStatus("loading");
    try {
      // Create a new FormData instance
      const formData = new FormData();
      const token = localStorage.getItem("authToken") || "";

      // Set fileUploading state if we have a file
      if (selectedFile) {
        setFileUploading(true);
      }

      // Trim all string values
      const trimmedData = {
        ...data,
        imageUrl: data.imageUrl?.trim() || "",
        domainName: data.domainName.trim().replace(/^www\./, ""),
        url: data.url.trim(),
        description: data.description.trim(),
        // Trim nested array objects
        reviewers: data.reviewers.map((reviewer) => ({
          name: reviewer.name.trim(),
          url: reviewer.url.trim(),
        })),
        keywords: data.keywords.map((keyword) => keyword.trim()),
        categories: data.categories.map((category) => category.trim()),
      };

      // Add form fields to the formData
      formData.append("url", trimmedData.url);
      formData.append("domainName", trimmedData.domainName);
      formData.append("description", trimmedData.description);
      formData.append("rating", trimmedData.rating.toString());
      formData.append("freeTrial", trimmedData.freeTrial.toString());
      formData.append("reviewers", JSON.stringify(trimmedData.reviewers));
      formData.append("keywords", JSON.stringify(trimmedData.keywords));
      formData.append("categories", JSON.stringify(trimmedData.categories));

      // If we have a selected file, add it to the form data
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageUrlCleared) {
        // If the image URL was cleared, send an empty string
        formData.append("imageURL", "");
      } else {
        // Otherwise, send the current image URL
        formData.append("imageURL", trimmedData.imageUrl);
      }

      // Call the API to update the product
      const updatedProduct = await fetch(
        `${API_BASE_URL}/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!updatedProduct.ok) {
        throw new Error("Failed to update product");
      }

      // Update the product list
      mutateProducts();

      // Show success state
      setSubmitStatus("success");

      toast({
        title: "Product updated",
        description: "Product updated successfully",
      });

      // Reset form state after a short delay
      setTimeout(() => {
        setOpen(false);
        setFileUploading(false);
        setHasChanges(false);
        setSubmitStatus("idle");
      }, 1500);
    } catch (error) {
      console.error("Error updating product:", error);
      setFileUploading(false);
      setSubmitStatus("error");

      // Reset to idle state after showing error
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    }
  };

  // This useEffect manages form state and image preview when the dialog opens/closes
  useEffect(() => {
    if (open && product) {
      // Reset the form with product data
      const resetImageUrl = product.imageURL || "";
      form.reset({
        imageUrl: resetImageUrl,
        imageFile: null,
        domainName: product.domainName || "",
        url: product.url || "",
        description: product.description || "",
        rating: product.rating,
        freeTrial: product.freeTrialAvailable,
        reviewers: product.reviewers,
        keywords: product.keywords,
        categories: product.categories,
      });

      // Store original data for change detection
      setOriginalData({
        imageUrl: resetImageUrl,
        imageFile: null,
        domainName: product.domainName || "",
        url: product.url || "",
        description: product.description || "",
        rating: product.rating,
        freeTrial: product.freeTrialAvailable,
        reviewers: product.reviewers,
        keywords: product.keywords,
        categories: product.categories,
      });

      // Only set the image preview if we're using the product's image URL and we don't already have a selected file
      if (!selectedFile && resetImageUrl) {
        setImagePreview(resetImageUrl);
      }
    } else {
      // Clean up state when dialog is closed
      setSelectedFile(null);
      setImagePreview(null);
      setImageUrlCleared(false); // Reset the cleared state when dialog closes
      setHasChanges(false);
    }
  }, [open, product, form, selectedFile, fileUploading]);

  useEffect(() => {
    if (!originalData || !open) return;

    // Check if any values have changed
    const hasFieldChanges =
      formValues.url !== originalData.url ||
      formValues.domainName !== originalData.domainName ||
      formValues.description !== originalData.description ||
      formValues.rating !== originalData.rating ||
      formValues.freeTrial !== originalData.freeTrial ||
      JSON.stringify(formValues.reviewers) !==
        JSON.stringify(originalData.reviewers) ||
      JSON.stringify(formValues.keywords) !==
        JSON.stringify(originalData.keywords) ||
      JSON.stringify(formValues.categories) !==
        JSON.stringify(originalData.categories);

    // Set hasChanges if any field changed or there are file/image changes
    if (hasFieldChanges || selectedFile || imageUrlCleared) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [formValues, originalData, selectedFile, imageUrlCleared, open]);

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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="edit-product-form"
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
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                setSelectedFile(null);
                                setImagePreview(e.target.value);
                              }
                            }}
                            disabled={!!selectedFile}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              field.onChange("");
                              setImagePreview(null);
                              setImageUrlCleared(true); // Mark as explicitly cleared
                            }}
                            disabled={!!selectedFile || !field.value}
                          >
                            Clear
                          </Button>
                        </div>
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
                              // Set uploading state to prevent preview from being cleared
                              setFileUploading(true);

                              // Set the selected file first
                              setSelectedFile(file);

                              // Clear the URL field completely
                              form.setValue("imageUrl", "", {
                                shouldValidate: true,
                              });

                              // Create preview URL
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                                // End the uploading state
                                setFileUploading(false);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          disabled={!!field.value || fileUploading}
                        />
                      </div>

                      {/* Preview area */}
                      {imagePreview && imagePreview.length > 0 && (
                        <div className="mt-4">
                          <FormLabel className="text-sm font-normal">
                            Preview:
                          </FormLabel>
                          <div className="relative h-[220px] w-full mt-2 border rounded-md overflow-hidden bg-gray-50">
                            <div className="relative w-full h-full">
                              <Image
                                src={imagePreview}
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
                  <FormLabel>Domain Name</FormLabel>
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
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={
                      (!hasChanges && !form.formState.isDirty) ||
                      submitStatus === "loading" ||
                      submitStatus === "success"
                    }
                  >
                    Update Tool
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Tool</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to update this tool?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      type="submit"
                      form="edit-product-form"
                      disabled={
                        (!hasChanges && !form.formState.isDirty) ||
                        submitStatus === "loading" ||
                        submitStatus === "success"
                      }
                      className="min-w-[140px]"
                      variant={
                        submitStatus === "error" ? "destructive" : "default"
                      }
                    >
                      {submitStatus === "loading"
                        ? "Saving..."
                        : submitStatus === "success"
                        ? "Tool Updated!"
                        : submitStatus === "error"
                        ? "Failed"
                        : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductCard;
