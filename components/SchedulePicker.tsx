"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { ChevronUp, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

type SchedulePickerProps = {
  value: Date | null | undefined
  onChange: (date: Date | null) => void
  disabled?: boolean
  buttonLabel?: string
  title?: string
  description?: string
  isScheduled?: boolean
  setIsScheduled: React.Dispatch<React.SetStateAction<boolean>>
}

export function SchedulePicker({
  value,
  onChange,
  isScheduled = false,
  setIsScheduled,
  title = "Schedule your video",
  description = "Schedule Video automates video uploads for timely publishing",
}: SchedulePickerProps) {
  const dateValue = useMemo(
    () => (value ? new Date(value) : undefined),
    [value]
  )

  const hours12 = useMemo(() => {
    if (!value) return "12"
    const d = new Date(value)
    const h = d.getHours() % 12 || 12
    return String(h).padStart(2, "0")
  }, [value])

  const minutes = useMemo(() => {
    if (!value) return "00"
    const d = new Date(value)
    return String(d.getMinutes()).padStart(2, "0")
  }, [value])

  const period = useMemo(() => {
    if (!value) return "AM"
    return new Date(value).getHours() >= 12 ? "PM" : "AM"
  }, [value])

  const ensureDate = (): Date => {
    if (value) return new Date(value)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }

  const handleDateSelect = (day: Date | undefined) => {
    if (!day) {
      onChange(null)
      return
    }
    const next = new Date(day)
    if (value) {
      const prev = new Date(value)
      next.setHours(prev.getHours(), prev.getMinutes(), 0, 0)
    } else {
      next.setHours(0, 0, 0, 0)
    }
    onChange(next)
  }

  const updateTime = (h12: number, min: number, ampm: string) => {
    const next = ensureDate()
    let h24 = h12 % 12
    if (ampm === "PM") h24 += 12
    next.setHours(h24, min, 0, 0)
    onChange(next)
  }

  const incrementHour = () => {
    const h = parseInt(hours12)
    const next = h >= 12 ? 1 : h + 1
    updateTime(next, parseInt(minutes), period)
  }

  const decrementHour = () => {
    const h = parseInt(hours12)
    const next = h <= 1 ? 12 : h - 1
    updateTime(next, parseInt(minutes), period)
  }

  const incrementMinute = () => {
    const m = parseInt(minutes)
    const next = m >= 59 ? 0 : m + 1
    updateTime(parseInt(hours12), next, period)
  }

  const decrementMinute = () => {
    const m = parseInt(minutes)
    const next = m <= 0 ? 59 : m - 1
    updateTime(parseInt(hours12), next, period)
  }

  const togglePeriod = () => {
    const newPeriod = period === "AM" ? "PM" : "AM"
    updateTime(parseInt(hours12), parseInt(minutes), newPeriod)
  }

  const handleToggle = () => {
    if (isScheduled) {
      onChange(null)
      setIsScheduled(false)
    } else {
      setIsScheduled(true)
    }
  }

  return (
    <div className="space-y-4">
      {isScheduled && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button variant={"ghost"} onClick={handleToggle}>
              <X />
            </Button>
          </div>
          <div className="w-fit rounded-lg border p-2">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleDateSelect}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-semibold">Time</span>
            <div className="flex items-center gap-3">
              {/* Hour : Minute */}
              <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                <div className="flex items-center gap-1">
                  <span className="w-6 text-center text-lg font-medium tabular-nums">
                    {hours12}
                  </span>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={incrementHour}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={decrementHour}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                  </div>
                </div>
                <span className="text-lg font-medium">:</span>
                <div className="flex items-center gap-1">
                  <span className="w-6 text-center text-lg font-medium tabular-nums">
                    {minutes}
                  </span>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={incrementMinute}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={decrementMinute}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* AM/PM */}
              <div className="flex items-center gap-1 rounded-lg bg-muted px-6 py-2">
                <span className="text-lg font-medium">{period}</span>
                <div className="ml-2 flex flex-col">
                  <button
                    type="button"
                    onClick={togglePeriod}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={togglePeriod}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {value && (
            <p className="text-sm text-muted-foreground">
              Scheduled: {format(new Date(value), "MMM dd, yyyy hh:mm a")}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
