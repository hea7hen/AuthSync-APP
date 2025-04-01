import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export interface UserSession {
  id: string
  name: string
  email: string
  iat: number
  exp: number
}

export interface Session {
  user: {
    id: string
    name: string
    email: string
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify<UserSession>(token, secret)

    return {
      user: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
      },
    }
  } catch (error) {
    return null
  }
}

