import type { Metadata } from "next"
import "./globals.css"
import { SWRProvider } from "@/lib/swr/SWRProvider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "OBS Admin Portal Template",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col font-sans">
        <SWRProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </SWRProvider>
      </body>
    </html>
  )
}
