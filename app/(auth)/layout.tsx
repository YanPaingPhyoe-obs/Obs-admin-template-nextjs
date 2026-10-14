"use client"

import React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="grid h-screen grid-cols-12 overflow-hidden bg-primary text-white">
        <section className="col-span-8 flex h-full items-center">
          <div className="mx-auto flex h-full w-full max-w-2xl items-center">
            <div className="fixed top-32">
              <img src="/Logo.svg" alt="logo" />
            </div>

            <div className="space-y-5">
              <h1 className="max-w-sm text-4xl leading-tight font-bold tracking-tight lg:text-6xl">
                Manage Everything in One Place
              </h1>
              <p className="max-w-md text-sm leading-7 text-primary-foreground/85 lg:text-base">
                Sign in to access your dashboard and manage your data, monitor
                activity, and stay in control of your workspace.
              </p>
            </div>
          </div>
        </section>

        <section className="col-span-4 flex animate-in items-center bg-white text-foreground duration-700 ease-out fade-in slide-in-from-right-[100%] lg:rounded-l-[3rem] lg:px-14">
          <div className="mx-auto w-full max-w-md">
            {children}
          </div>
        </section>
      </div>
    </div>
  )
}
