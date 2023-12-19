import { db } from "@/lib/db";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials: any) {
                try {
                    const user:any = await db.user.findUnique({
                        where: { email: credentials.email }
                    })
                    if (user) {
                        const passCompare = await bcrypt.compare(credentials.password, user.password)
                        if (passCompare) {
                            return user
                        } else {
                            throw new Error("Invalid Credential")
                        }
                    } else {
                        throw new Error('Email not registered')
                    }
                } catch (error: any) {
                    throw new Error(error.message)
                }

            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            // authorization: {
            //     params: {
            //       prompt: "consent",
            //       access_type: "offline",
            //       response_type: "code"
            //     }
            // }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? ''
        })
        
    ],
    callbacks: {
        async signIn({ user, account }: any) {
            if (account.provider === "google" || account.provider === 'github') {
                try {
                    const userData = await db.user.findUnique({
                        where: { email: user.email }
                    })
                    if (!userData) {
                        await db.user.create({
                            data: {
                                name: user.name,
                                email: user.email,
                                password: "",
                                provider: account.provider,
                                isEmailVerified: true
                            }
                        })
                        return true
                    } else {
                        return true
                    }
                } catch (error: any) {
                    console.log(error.message)
                    return false
                }
            } else {
                return true
            }
        },
    }
}

export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }