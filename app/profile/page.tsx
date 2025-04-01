"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppLayout from "@/components/app-layout"
import ProfileOverview from "@/components/profile-overview"
import ProfileSettings from "@/components/profile-settings"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
  })

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "settings") {
      setActiveTab("settings")
    } else {
      setActiveTab("overview")
    }
  }, [searchParams])

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/auth/profile")

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/auth/login")
            return
          }
          throw new Error("Failed to fetch profile data")
        }

        const data = await response.json()
        setUserData(data.user)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router, toast])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/profile${value === "settings" ? "?tab=settings" : ""}`)
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Profile Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <ProfileOverview isLoading={isLoading} userData={userData} />
          </TabsContent>
          <TabsContent value="settings">
            <ProfileSettings isLoading={isLoading} userData={userData} setUserData={setUserData} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

