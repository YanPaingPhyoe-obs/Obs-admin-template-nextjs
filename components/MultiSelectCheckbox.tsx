"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export type MultiSelectOption = {
  label: string
  value: string
}

type MultiSelectCheckboxProps = {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function MultiSelectCheckbox({
  options,
  value,
  onChange,
  placeholder = "Select -",
  disabled = false,
}: MultiSelectCheckboxProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const remove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue))
  }

  const selectedOptions = options.filter((o) => value.includes(o.value))

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="relative">
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault()
              setOpen((prev) => !prev)
            }
          }}
          className={cn(
            "flex min-h-9 w-full cursor-pointer items-center rounded-md border border-input bg-neutral-100 px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            disabled && "pointer-events-none cursor-not-allowed opacity-50",
            !value.length && "text-muted-foreground"
          )}
        >
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1">
              {selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(option.value)
                    }}
                    disabled={disabled}
                    className="rounded-full outline-none hover:bg-muted disabled:pointer-events-none"
                  >
                    <X className="size-3" />
                    <span className="sr-only">Remove {option.label}</span>
                  </button>
                </span>
              ))}
            </div>
          ) : (
            placeholder
          )}
        </div>

        {open && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-input bg-white shadow-md">
            {options.map((option) => {
              const checked = value.includes(option.value)
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted/50"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(option.value)}
                    disabled={disabled}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              )
            })}
            {options.length === 0 && (
              <div className="px-3 py-2.5 text-sm text-muted-foreground">
                No options available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
