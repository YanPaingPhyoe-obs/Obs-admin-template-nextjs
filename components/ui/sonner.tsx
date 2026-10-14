"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  const LogoIcon = (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center">
      <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
    </div>
  )

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: LogoIcon,
        info: LogoIcon,
        warning: LogoIcon,
        error: LogoIcon,
        loading: LogoIcon,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast !bg-white !text-slate-900 !border !border-gray-100 !shadow-xl !px-4 !py-4 !flex !items-center !gap-4 !w-full !max-w-[420px]",
          description: "!text-gray-500 !text-[14px] !font-medium !m-0",
          title: "!text-[16px] !font-bold !text-slate-900 !m-0",
          icon: "!bg-transparent !p-0 !m-0 !w-10 !h-10 !flex !shrink-0 !items-center !justify-center",
          content: "!flex !flex-col !gap-1 !m-0 !p-0",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
