"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/layout/AppHeader"
import { RichTextEditor } from "@/components/RichTextEditor"
import { Button } from "@/components/ui/button"
import {
  useGetPrivacyPolicy,
  useUpdatePrivacyPolicy,
} from "../hooks/useSettings"

export default function PrivacyPolicy() {
  const { data, isLoading } = useGetPrivacyPolicy()
  const { mutate: update, isPending } = useUpdatePrivacyPolicy()
  const [content, setContent] = useState("")

  useEffect(() => {
    if (data?.data?.privacyPolicy) {
      setContent(data.data.privacyPolicy)
    }
  }, [data])

  const handleSave = () => {
    update({ privacyPolicy: content })
  }

  return (
    <div className="flex flex-col">
      <AppHeader title="Privacy Policy" />

      <div className="m-4 rounded-lg bg-white p-6">
        <label className="mb-2 block text-sm font-medium">Privacy Policy</label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Define Privacy Policy"
          disabled={isLoading}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setContent(data?.data?.privacyPolicy ?? "")}
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
