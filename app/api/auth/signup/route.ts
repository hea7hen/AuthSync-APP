import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase, User } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      profilePicture: "",
    })

    // Remove password from response
    const newUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    }

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "An error occurred during signup" }, { status: 500 })
  }
}

