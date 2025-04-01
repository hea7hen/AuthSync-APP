import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileOverviewProps {
  isLoading: boolean
  userData: {
    name: string
    email: string
    phone: string
    profilePicture: string
  }
}

export default function ProfileOverview({ isLoading, userData }: ProfileOverviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="w-full space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>View your profile information</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <Avatar className="h-24 w-24">
          {userData.profilePicture ? <AvatarImage src={userData.profilePicture} alt={userData.name} /> : null}
          <AvatarFallback className="text-2xl">
            {userData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-base">{userData.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-base">{userData.email}</p>
            </div>
            {userData.phone && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p className="text-base">{userData.phone}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

