# Feature Module Rules

## API Endpoints — Postman Collection

**Do NOT ask the user for API endpoints.** Instead, read the Postman collection at the project root:

```
/postman_collection.json
```

Search this file for the relevant resource name to find the correct base URL, HTTP methods, request/response shapes, and query parameters. Use these to populate `endpoint` in the service file and to define the TypeScript interface fields.

***

## Always Clarify Pattern Before Generating

When asked to generate a new feature, **do not write any code** until you know which pattern to use.
Use the `/new-feature` command or ask manually:

> "Does this feature need a **dialog (popup)** or **navigate to a new page**?"

***

## Pattern A: Dialog-Based (Modal/Popup)

**When to use:**

- Simple resource with 1-5 fields
- No separate detail/view page needed
- User stays on the list page throughout all actions
- Registers 1 route

### Files to Create

```
feature/[name]/
├── types.ts
├── services/
│   └── [name].service.ts
├── hooks/
│   └── use[Name]s.ts
├── components/
│   ├── [Name]Table.tsx
│   └── [Name]FormDialog.tsx
├── page/
│   └── [Name]List.tsx
└── routes/
    └── routes.tsx
```

***

## Pattern B: Page-Based (Navigate to Another Page)

**When to use:**

- Complex resource with 5+ fields
- Needs a read-only detail/view page
- Needs separate Create and Edit pages
- Has nested data or related resources
- Registers 4 routes

### Files to Create

```
feature/[name]/
├── types.ts
├── services/
│   └── [name].service.ts
├── hooks/
│   └── use[Name]s.ts
├── components/
│   ├── [Name]Table.tsx
│   └── [Name]Form.tsx              # Shared between Create and Edit pages
├── page/
│   ├── [Name]List.tsx
│   ├── [Name]Create.tsx
│   ├── [Name]Detail.tsx
│   └── [Name]Edit.tsx
└── routes/
    └── routes.tsx
```

***

## Required Field Labels

Every mandatory form field must show a red asterisk (`*`) next to its label. Optional fields should show "Optional" text instead.

```tsx
// Required field
<FormLabel>Name <span className="text-destructive">*</span></FormLabel>

// Optional field
<FormLabel>
  Note <span className="font-normal text-muted-foreground">Optional</span>
</FormLabel>

// For plain <label> elements (e.g. nested dialogs)
<label className="text-sm font-medium">Title <span className="text-destructive">*</span></label>
```

***

## After Creating Any Feature — Checklist

```
1. [ ] Register routes in src/router/router.tsx
       import { productRoutes } from "@/feature/products/routes/routes"
       // spread into children array: ...productRoutes

2. [ ] Add nav item in src/layout/sidebar/nav-items.ts

3. [ ] Verify API endpoint matches postman_collection.json

4. [ ] Test: list renders, create works, edit works, delete works
```

***

## Full Template — Pattern A (Dialog-Based)

Below is the complete code for every file. Replace `Product`/`product` with the actual feature name.

### `types.ts`

```ts
import { z } from "zod"

export interface Product {
  id: string
  name: string
  createdAt: string
}

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
```

### `services/product.service.ts`

```ts
import { apiClient } from "@/api/client"
import type { Product } from "../types"
import type { ApiResponse, PaginatedApiResponse } from "@/api/types"

const endpoint = "/products" // <- get from postman_collection.json

export const getAllProducts = async (
  params?: Record<string, unknown>
): Promise<PaginatedApiResponse<Product>> => {
  const response = await apiClient.get<PaginatedApiResponse<Product>>(endpoint, { params })
  return response.data
}

export const getProductById = async (
  id: string | number
): Promise<ApiResponse<Product>> => {
  const response = await apiClient.get<ApiResponse<Product>>(`${endpoint}/${id}`)
  return response.data
}

export const createProduct = async (
  data: { name: string }
): Promise<ApiResponse<Product>> => {
  const response = await apiClient.post<ApiResponse<Product>>(endpoint, data)
  return response.data
}

export const updateProduct = async (
  id: string | number,
  data: { name: string }
): Promise<ApiResponse<Product>> => {
  const response = await apiClient.patch<ApiResponse<Product>>(`${endpoint}/${id}`, data)
  return response.data
}

export const deleteProduct = async (
  id: string | number
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`${endpoint}/${id}`)
  return response.data
}
```

### `hooks/useProducts.ts`

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct as deleteProductService,
} from "../services/product.service"
import type { Product } from "../types"
import type { ApiResponse } from "@/api/types"

export const useGetProducts = (
  params?: Record<string, string | undefined>
) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getAllProducts(params),
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<Product>,
    AxiosError<{ message: string }>,
    { name: string }
  >({
    mutationFn: (data) => createProduct(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product created", {
        description:
          response.message || "Product has been created successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to create product", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<Product>,
    AxiosError<{ message: string }>,
    { id: string; data: { name: string } }
  >({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product updated", {
        description:
          response.message || "Product has been updated successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to update product", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<void>,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: (id) => deleteProductService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product deleted", {
        description: "Product has been deleted successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to delete product", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}
```

### `components/ProductTable.tsx`

```tsx
import { useState, useMemo } from "react"
import { Pencil, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { ProductFormDialog } from "./ProductFormDialog"
import { useDeleteProduct } from "../hooks/useProducts"
import type { Product } from "../types"
import { DataTable } from "@/components/DataTable"

type ProductTableProps = {
  data: Product[]
  isLoading?: boolean
  offset?: number
}

export function ProductTable({
  data,
  isLoading,
  offset = 0,
}: ProductTableProps) {
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()

  const handleConfirmDelete = () => {
    if (!deleteId) return
    deleteProduct(deleteId, { onSuccess: () => setDeleteId(null) })
  }

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => offset + row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Product",
      },
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setEditProduct(product)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setDeleteId(product.id)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          )
        },
      },
    ],
    [offset]
  )

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products found."
      />

      <ProductFormDialog
        open={!!editProduct}
        onOpenChange={(open) => {
          if (!open) setEditProduct(undefined)
        }}
        product={editProduct}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
      />
    </>
  )
}
```

### `components/ProductFormDialog.tsx`

```tsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { productFormSchema, type Product, type ProductFormValues } from "../types"
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts"

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: ProductFormDialogProps) {
  const isCreate = !product
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()
  const isPending = isCreating || isUpdating

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (!open) return
    if (product) {
      form.reset({ name: product.name })
    } else {
      form.reset({ name: "" })
    }
  }, [open, product, form])

  const onSubmit = (values: ProductFormValues) => {
    if (isCreate) {
      createProduct(values, { onSuccess: () => onOpenChange(false) })
    } else {
      updateProduct(
        { id: product!.id, data: values },
        { onSuccess: () => onOpenChange(false) }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Add New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Something"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                {isCreate ? "Create" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### `page/ProductList.tsx`

```tsx
import { useState } from "react"
import { useSearchParams } from "react-router"
import { Plus } from "lucide-react"
import { AppHeader } from "@/layout/AppHeader"
import { useGetProducts } from "../hooks/useProducts"
import { ProductTable } from "../components/ProductTable"
import { ProductFormDialog } from "../components/ProductFormDialog"
import { DataPagination } from "@/components/DataPagination"
import SearchBar from "@/components/SearchBar"

const ProductList = () => {
  const [searchParams] = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)
  const search = searchParams.get("search") ?? ""
  const page = searchParams.get("page") ?? "1"
  const limit = searchParams.get("limit") ?? "10"

  const { data, isLoading } = useGetProducts({ page, limit, search })

  const total = data?.meta?.total ?? 0
  const offset = (Number(page) - 1) * Number(limit)

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Products"
        total={total}
        action={{
          type: "button",
          label: "Add New",
          icon: <Plus className="size-4" />,
          onClick: () => setCreateOpen(true),
        }}
      />

      <div className="table-shadow m-4 flex flex-col gap-0 rounded-t-md rounded-b-md bg-white">
        <SearchBar title="Search by product name" />
        <div>
          <ProductTable
            data={data?.data ?? []}
            isLoading={isLoading}
            offset={offset}
          />
        </div>
        {data?.meta && <DataPagination meta={data.meta} />}
      </div>

      <ProductFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}

export default ProductList
```

### `routes/routes.tsx`

```tsx
import type { RouteObject } from "react-router"
import ProductList from "../page/ProductList"

export const productRoutes: RouteObject[] = [
  {
    path: "products",
    element: <ProductList />,
  },
]
```

***

## Full Template — Pattern B (Page-Based)

Below is the complete code for every file. Replace `Product`/`product` with the actual feature name.

### `types.ts`

```ts
import { z } from "zod"

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  isActive?: boolean
  createdAt: string
}

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or more"),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
```

### `services/product.service.ts`

```ts
import { apiClient } from "@/api/client"
import type { Product } from "../types"
import type { ApiResponse, PaginatedApiResponse } from "@/api/types"

const endpoint = "/products" // <- get from postman_collection.json

export const getAllProducts = async (
  params?: Record<string, unknown>
): Promise<PaginatedApiResponse<Product>> => {
  const response = await apiClient.get<PaginatedApiResponse<Product>>(endpoint, { params })
  return response.data
}

export const getProductById = async (
  id: string
): Promise<ApiResponse<Product>> => {
  const response = await apiClient.get<ApiResponse<Product>>(`${endpoint}/${id}`)
  return response.data
}

export const createProduct = async (
  data: Record<string, unknown>
): Promise<ApiResponse<Product>> => {
  const response = await apiClient.post<ApiResponse<Product>>(endpoint, data)
  return response.data
}

export const updateProduct = async (
  id: string,
  data: Record<string, unknown>
): Promise<ApiResponse<Product>> => {
  const response = await apiClient.patch<ApiResponse<Product>>(`${endpoint}/${id}`, data)
  return response.data
}

export const deleteProduct = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`${endpoint}/${id}`)
  return response.data
}
```

### `hooks/useProducts.ts`

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct as deleteProductService,
} from "../services/product.service"
import type { Product } from "../types"
import type { ApiResponse } from "@/api/types"

export const useGetProducts = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getAllProducts(params),
  })
}

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<Product>,
    AxiosError<{ message: string }>,
    Record<string, unknown>
  >({
    mutationFn: (data) => createProduct(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product created", {
        description:
          response.message || "Product has been created successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to create product", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<Product>,
    AxiosError<{ message: string }>,
    { id: string; data: Record<string, unknown> }
  >({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product updated", {
        description:
          response.message || "Product has been updated successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to update product", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<void>,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: (id) => deleteProductService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product deleted", {
        description: "Product has been deleted successfully.",
      })
    },
    onError: (error) => {
      toast.error("Failed to delete product", {
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}
```

### `components/ProductTable.tsx`

```tsx
import { useState, useMemo } from "react"
import { ExternalLink, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { useDeleteProduct } from "../hooks/useProducts"
import type { Product } from "../types"
import { DataTable } from "@/components/DataTable"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ProductTableProps = {
  data: Product[]
  isLoading?: boolean
  offset?: number
}

export function ProductTable({
  data,
  isLoading,
  offset = 0,
}: ProductTableProps) {
  const navigate = useNavigate()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()

  const handleConfirmDelete = () => {
    if (!deleteId) return
    deleteProduct(deleteId, { onSuccess: () => setDeleteId(null) })
  }

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => offset + row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      // add more columns based on fields
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <ExternalLink className="mr-2 size-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setDeleteId(product.id)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [offset, navigate]
  )

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products found."
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
      />
    </>
  )
}
```

### `components/ProductForm.tsx`

```tsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  productFormSchema,
  type Product,
  type ProductFormValues,
} from "../types"

type ProductFormProps = {
  onSubmit: (values: ProductFormValues) => void
  isPending: boolean
  onCancel: () => void
  product?: Product
}

export function ProductForm({
  onSubmit,
  isPending,
  onCancel,
  product,
}: ProductFormProps) {
  const isCreate = !product

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description ?? "",
        price: Number(product.price),
      })
    }
  }, [product, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-2xl space-y-6 rounded-lg bg-white p-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Price"
                  onChange={(e) => field.onChange(Number(e.target.value ?? 0))}
                  value={field.value ?? ""}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* add more FormFields based on schema */}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            {isCreate ? "Add" : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

### `page/ProductList.tsx`

```tsx
import { useSearchParams, useNavigate } from "react-router"
import { Plus } from "lucide-react"
import { AppHeader } from "@/layout/AppHeader"
import { useGetProducts } from "../hooks/useProducts"
import { ProductTable } from "../components/ProductTable"
import { DataPagination } from "@/components/DataPagination"
import SearchBar from "@/components/SearchBar"

const ProductList = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const page = searchParams.get("page") ?? "1"
  const limit = searchParams.get("limit") ?? "10"
  const search = searchParams.get("search") || undefined

  const { data, isLoading } = useGetProducts({ page, limit, search })

  const total = data?.meta?.total ?? 0
  const offset = (Number(page) - 1) * Number(limit)

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Products"
        total={total}
        action={{
          type: "button",
          label: "Add New",
          icon: <Plus className="size-4" />,
          onClick: () => navigate("/products/create"),
        }}
      />

      <div className="table-shadow m-4 flex flex-col gap-0 rounded-t-md rounded-b-md bg-white">
        <SearchBar title="Search by name" />
        <ProductTable
          data={data?.data ?? []}
          isLoading={isLoading}
          offset={offset}
        />
        {data?.meta && <DataPagination meta={data.meta} />}
      </div>
    </div>
  )
}

export default ProductList
```

### `page/ProductCreate.tsx`

```tsx
import { useNavigate } from "react-router"
import { AppHeader } from "@/layout/AppHeader"
import { ProductForm } from "../components/ProductForm"
import { useCreateProduct } from "../hooks/useProducts"
import type { ProductFormValues } from "../types"

const ProductCreate = () => {
  const navigate = useNavigate()
  const { mutate: createProduct, isPending } = useCreateProduct()

  const handleSubmit = (values: ProductFormValues) => {
    createProduct(values, {
      onSuccess: () => navigate("/products"),
    })
  }

  return (
    <div className="flex flex-col">
      <AppHeader title="Create Product" action={{ type: "none" }} />

      <div className="m-4">
        <ProductForm
          onSubmit={handleSubmit}
          isPending={isPending}
          onCancel={() => navigate("/products")}
        />
      </div>
    </div>
  )
}

export default ProductCreate
```

### `page/ProductEdit.tsx`

```tsx
import { useNavigate, useParams } from "react-router"
import { AppHeader } from "@/layout/AppHeader"
import { ProductForm } from "../components/ProductForm"
import { useGetProduct, useUpdateProduct } from "../hooks/useProducts"
import type { ProductFormValues } from "../types"

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useGetProduct(id!)
  const { mutate: updateProduct, isPending } = useUpdateProduct()

  const handleSubmit = (values: ProductFormValues) => {
    updateProduct(
      { id: id!, data: values },
      { onSuccess: () => navigate("/products") }
    )
  }

  if (isLoading) return null

  return (
    <div className="flex flex-col">
      <AppHeader title="Edit Product" action={{ type: "none" }} />

      <div className="m-4">
        <ProductForm
          onSubmit={handleSubmit}
          isPending={isPending}
          onCancel={() => navigate("/products")}
          product={data?.data}
        />
      </div>
    </div>
  )
}

export default ProductEdit
```

### `page/ProductDetail.tsx`

```tsx
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/layout/AppHeader"
import { useGetProduct } from "../hooks/useProducts"

function DetailField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="text-sm">{children || <span className="text-muted-foreground">-</span>}</div>
    </div>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <span className="inline-block rounded bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
      {label}
    </span>
  )
}

export default function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetProduct(id!)

  const product = data?.data

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Product Detail"
        action={{
          type: "button",
          label: "Back",
          variant: "outline",
          icon: <ArrowLeft className="size-4" />,
          onClick: () => navigate(-1),
        }}
      />

      <div className="m-2 flex-1 space-y-6">
        <section className="space-y-4 rounded-md bg-white p-4">
          <div className="flex items-center justify-between">
            <SectionHeader label="Product Information" />
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/products/${product.id}/edit`)}
            >
              <Pencil className="mr-1.5 size-3.5" />
              Edit
            </Button>
          </div>

          <DetailField label="Name">{product.name}</DetailField>
          {/* add more DetailField rows based on fields */}
        </section>
      </div>
    </div>
  )
}
```

### `routes/routes.tsx`

```tsx
import type { RouteObject } from "react-router"
import ProductList from "../page/ProductList"
import ProductCreate from "../page/ProductCreate"
import ProductEdit from "../page/ProductEdit"
import ProductDetail from "../page/ProductDetail"

export const productRoutes: RouteObject[] = [
  {
    path: "products",
    element: <ProductList />,
  },
  {
    path: "products/create",
    element: <ProductCreate />,
  },
  {
    path: "products/:id",
    element: <ProductDetail />,
  },
  {
    path: "products/:id/edit",
    element: <ProductEdit />,
  },
]
```