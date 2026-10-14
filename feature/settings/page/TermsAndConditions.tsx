"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/layout/AppHeader"
import { RichTextEditor } from "@/components/RichTextEditor"
import { Button } from "@/components/ui/button"
import {
  useGetTermAndCondition,
  useUpdateTermAndCondition,
} from "../hooks/useSettings"

export default function TermsAndConditions() {
  const { data, isLoading } = useGetTermAndCondition()
  const { mutate: update, isPending } = useUpdateTermAndCondition()
  const [content, setContent] = useState("")

  useEffect(() => {
    if (data?.data?.termAndCondition) {
      setContent(data.data.termAndCondition)
    }
  }, [data])

  const handleSave = () => {
    update({ termAndCondition: content })
  }

  return (
    <div className="flex flex-col">
      <AppHeader title="Terms & Conditions" />

      <div className="m-4 rounded-lg bg-white p-6">
        <label className="mb-2 block text-sm font-medium">
          Terms & Conditions
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Define T&C"
          disabled={isLoading}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setContent(data?.data?.termAndCondition ?? "")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || isLoading}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
