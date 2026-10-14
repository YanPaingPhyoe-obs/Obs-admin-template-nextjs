import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-64 items-center justify-center text-3xl text-muted-foreground">
      404 Not Found
      <br />
      <Link href="/" className="text-blue-500 underline">
        Go Home
      </Link>
    </div>
  )
}
