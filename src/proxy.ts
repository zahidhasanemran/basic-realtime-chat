import { NextRequest, NextResponse } from "next/server"
import { redis } from "./lib/redis"
import { nanoid } from "nanoid"
import { TOKEN_MAX_AGE } from "./lib/constants"

export const proxy = async (req: NextRequest) => {
  // check: if the user allowed to join room 
  // Pass or send back to lobby 

  const pathname = req.nextUrl.pathname;
  const roomMatch = pathname.match(/^\/room\/([^/]+)$/)

  if(!roomMatch) return NextResponse.redirect(new URL("/", req.url))
  
  const roomId = roomMatch[1];
  
  const meta = await redis.hgetall<{connected: string[], createdAt: number}>(`meta:${roomId}`)

  if(!meta) {
    return NextResponse.redirect(new URL("/?error=room-not-found", req.url))
  }

  const existingToken = req.cookies.get("x-auth-token")?.value;
  const response = NextResponse.next();

  // User is allowed to join room 
  if(existingToken && meta.connected.includes(existingToken)){
    return NextResponse.next();
  }

  // Room is already full 
  if(meta.connected.length >= 2){
    return NextResponse.redirect(new URL("/?error=room-full", req.url))
  }

  const token = nanoid();
    response.cookies.set("x-auth-token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: TOKEN_MAX_AGE
    })

  await redis.hset(`meta:${roomId}`, {
    connected: [...meta.connected, token]
  })
  
  

  return response

}

export const config = {
  matcher: "/room/:path*"
}