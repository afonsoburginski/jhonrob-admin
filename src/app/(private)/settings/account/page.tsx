// SettingsAccountPage.tsx
import React from "react"
import { Separator } from "@/components/ui/separator"
import { AccountForm } from "./account-form"
import { SidebarNav } from "../components/sidebar-nav"

export default function SettingsAccountPage() {
  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="hidden space-y-6 p-10 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Update your account settings. Set your preferred language and timezone.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div>
                  <h3 className="text-lg font-medium">Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your account settings. Set your preferred language and timezone.
                  </p>
                </div>
                <Separator />
                <AccountForm />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}