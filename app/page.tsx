import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AppLayout from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Home() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {session.user.name}!</CardTitle>
            <CardDescription>This is your personal dashboard. Navigate using the menu options.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>
              You're now logged into your account. You can manage your profile, update your settings, and access other
              features from the navigation menu.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <a href="/profile">View Profile</a>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <a href="/profile?tab=settings">Edit Settings</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

