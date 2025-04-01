"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, User, Settings, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to logout")
      }

      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })

      router.push("/auth/login")
      router.refresh()
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/profile?tab=settings", icon: Settings },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation with Drawer for Mobile */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-14 items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 py-4">
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={pathname === item.path ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      router.push(item.path)
                    }}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Button>
                ))}
                <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Side Navigation for Desktop */}
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <nav className="flex flex-col gap-2 p-4">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={pathname === item.path ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => router.push(item.path)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background md:hidden">
        <div className="grid h-16 grid-cols-3">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="flex h-full flex-col items-center justify-center rounded-none"
              onClick={() => router.push(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Add padding to bottom on mobile to account for the bottom navigation */}
      <div className="pb-16 md:pb-0"></div>
    </div>
  )
}

