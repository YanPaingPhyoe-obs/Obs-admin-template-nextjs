import { z } from "zod"

export interface Category {
  id: string
  name: string
  createdAt: string
}

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
