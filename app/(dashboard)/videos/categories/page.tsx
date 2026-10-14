import { Suspense } from "react"
import CategoryList from "@/feature/categories/page/CategoryList"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CategoryList />
    </Suspense>
  )
}
