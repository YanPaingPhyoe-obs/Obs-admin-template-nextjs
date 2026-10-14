"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import Link from "next/link"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="text-xl font-medium text-destructive">
            Something went wrong
          </p>
          <p className="text-sm">{this.state.error?.message}</p>
          <Link
            href="/"
            className="text-sm text-blue-500 underline"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Go Home
          </Link>
        </div>
      )
    }
    return this.props.children
  }
}
