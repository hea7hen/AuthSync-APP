import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase, User } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id).select("-password")

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        profilePicture: user.profilePicture || "",
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ message: "An error occurred while fetching profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, email, phone, password, profilePicture } = await request.json()

    await connectToDatabase()

    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update user fields
    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone !== undefined ? phone : user.phone
    user.profilePicture = profilePicture !== undefined ? profilePicture : user.profilePicture

    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    await user.save()

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        profilePicture: user.profilePicture || "",
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "An error occurred while updating profile" }, { status: 500 })
  }
}

