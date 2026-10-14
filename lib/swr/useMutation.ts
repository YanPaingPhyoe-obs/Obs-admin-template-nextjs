"use client"

import { useState, useCallback } from "react"

export interface UseMutationOptions<TData = any, TVariables = any, TError = any> {
  mutationFn: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: TError, variables: TVariables) => void
}

export interface MutateCallOptions<TData = any, TError = any> {
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
}

export function useMutation<TData = any, TVariables = any, TError = any>({
  mutationFn,
  onSuccess,
  onError,
}: UseMutationOptions<TData, TVariables, TError>) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<TError | null>(null)
  const [data, setData] = useState<TData | null>(null)

  const mutate = useCallback(
    async (
      variables: TVariables,
      callOptions?: MutateCallOptions<TData, TError>
    ) => {
      setIsPending(true)
      setError(null)
      try {
        const result = await mutationFn(variables)
        setData(result)
        onSuccess?.(result, variables)
        callOptions?.onSuccess?.(result)
        return result
      } catch (err: any) {
        setError(err as TError)
        onError?.(err as TError, variables)
        callOptions?.onError?.(err as TError)
        return undefined as any
      } finally {
        setIsPending(false)
      }
    },
    [mutationFn, onSuccess, onError]
  )

  const mutateAsync = useCallback(
    async (variables: TVariables) => {
      setIsPending(true)
      setError(null)
      try {
        const result = await mutationFn(variables)
        setData(result)
        onSuccess?.(result, variables)
        return result
      } catch (err: any) {
        setError(err as TError)
        onError?.(err as TError, variables)
        throw err
      } finally {
        setIsPending(false)
      }
    },
    [mutationFn, onSuccess, onError]
  )

  return { mutate, mutateAsync, isPending, error, data }
}
