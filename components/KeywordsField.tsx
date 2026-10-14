"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type KeywordsFieldProps = {
  value: string[]
  onChange: (keywords: string[]) => void
}

export function KeywordsField({
  value,
  onChange,
}: KeywordsFieldProps) {
  const [keywordInput, setKeywordInput] = useState("")

  const addKeyword = () => {
    const trimmed = keywordInput.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setKeywordInput("")
  }

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyword()
    }
  }

  const removeKeyword = (keyword: string) => {
    onChange(value.filter((k) => k !== keyword))
  }

  return (
    <div className="space-y-2">
      <Label>Keywords</Label>
      <div className="flex items-center gap-2">
        <Input
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={handleKeywordKeyDown}
          placeholder="Keywords"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={addKeyword}
          className="shrink-0"
        >
          <Plus className="size-4" />
          <span className="sr-only">Add keyword</span>
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium"
            >
              {kw}
              <button
                type="button"
                onClick={() => removeKeyword(kw)}
                className="ml-0.5 rounded-sm hover:bg-muted-foreground/20"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
