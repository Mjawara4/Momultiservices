import * as z from "zod";

export const orderFormSchema = z.object({
  websiteLink: z.string().url("Please enter a valid URL"),
  itemDetails: z.string().min(10, "Please provide more details about the items"),
  orderAmount: z.coerce
    .number()
    .min(0.01, "Order amount must be greater than 0")
    .max(1000000, "Order amount cannot exceed $1,000,000"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  screenshot: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Screenshot is required")
    .refine(
      (files) =>
        files[0]?.type === "image/jpeg" ||
        files[0]?.type === "image/png" ||
        files[0]?.type === "image/webp",
      "Only .jpg, .png, and .webp formats are supported"
    ),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;