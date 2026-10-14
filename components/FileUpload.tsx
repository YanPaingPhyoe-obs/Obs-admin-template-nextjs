"use client"

import { useCallback, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { UploadIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type FileUploadProps = {
  value?: File | string | null
  onChange: (file: File | null) => void
  accept?: Record<string, string[]>
  disabled?: boolean
  hint?: string
  label?: string
}

export function FileUpload({
  value,
  onChange,
  accept = { "image/jpeg": [], "image/png": [] },
  disabled = false,
  hint = "Our suggested dimensions are 24px*24px. Larger image will be cropped to 1:1 to fit our icon photo.",
  label,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onChange(acceptedFiles[0])
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    disabled,
  })

  const previewSrc = useMemo(() => {
    if (value instanceof File) return URL.createObjectURL(value)
    if (typeof value === "string" && value) return value
    return null
  }, [value])

  const acceptLabel = Object.keys(accept)
    .map((t) => t.split("/")[1]?.toUpperCase())
    .filter(Boolean)
    .join(" or ")

  if (previewSrc) {
    return (
      <div className="relative inline-block">
        <img
          src={previewSrc}
          alt="Preview"
          className="size-28 rounded-lg border object-cover"
        />
        {!disabled && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 size-6 rounded-full"
            onClick={() => onChange(null)}
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-8 text-center transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-muted-foreground/50"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        <UploadIcon className="size-6 text-muted-foreground/60" />
        <p className="text-sm text-muted-foreground">
          Drag and drop file or choose file to upload
        </p>
        <Button type="button" variant="outline" size="sm" disabled={disabled}>
          Upload
        </Button>
      </div>
      {acceptLabel && (
        <p className="mt-1.5 text-xs font-medium text-muted-foreground">
          <span className="font-semibold">{label ?? "Poster Image"}</span> ({acceptLabel})
        </p>
      )}
      {hint && (
        <p className="mt-0.5 text-xs text-muted-foreground/70">
          Note: {hint}
        </p>
      )}
    </div>
  )
}
