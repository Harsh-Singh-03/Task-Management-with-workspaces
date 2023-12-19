"use server"
import { db } from "@/lib/db"
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/lib/Mail"
// email verification request
export const verifyEmail = async (email: string) => {
    try {
        let user = await db.user.findUnique({ where: { email } })
        if (!user || user.isEmailVerified || user.provider !== 'credential') {
            return { success: false, message: "Inavild request" }
        }
        const token = crypto.randomBytes(32).toString("hex")
        await db.user.update({
            where: { email },
            data: { emailVerificationToken: token }
        })
        const url = `${process.env.NEXTAUTH_URL}/verify-email/${user.id}/${token}`
        let Text = `<h1>Hello ${user.name}</h1>
                    <p>Please verify your email</p>
                    <a href=${url} target="_blank">Click Here To Verify</a>`
        await sendEmail(user.email, "Email Verification", Text)
        return {
            success: true,
            message: "Email Sent"
        }
    } catch (error) {
        return { success: false, message: "Server error try again later!" }
    }
}
// email verify
export const updateUserEmailVerification = async (id: string, token: string) => {
    try {
        const data = await db.user.update({
            where: { id, emailVerificationToken: token },
            data: { isEmailVerified: true }
        })
        if (!data) return { success: false, message: 'Invaild request!' }
        return { success: true, message: 'Email verified!!' }
    } catch (error) {
        return { success: false, message: "Server error try again later!" }
    }
}
// verifiy
export const resetPassRequest = async (email: string) => {
    try {
        let user = await db.user.findUnique({ where: { email } })
        if (!user || user.provider !== 'credential' ) {
            return { success: false, message: "Inavild request" }
        }
        const token = crypto.randomBytes(32).toString("hex")
        await db.user.update({
            where: { email },
            data: { resetPasswordToken: token }
        })
        const url = `${process.env.NEXTAUTH_URL}/reset-password/${user.id}/${token}`
        let Text = `<h1>Hello ${user.name}</h1>
                    <p>Here is your reset password url</p>
                    <a href=${url} target="_blank">Click Here To Reset Password</a>`
        await sendEmail(user.email, "Reset Password", Text)
        return {
            success: true,
            message: "Email Sent"
        }
    } catch (error) {
        return { success: false, message: "Server error try again later!" }
    }
}
// resetPass
export const resetPassUser =async (id: string, token: string, newPass: string) => {
    try {
        if(newPass.length < 8 ) return {success: false, message: 'Password length should be 8 character long!'} 
        const salt = await bcrypt.genSalt(10)
        const securePass = await bcrypt.hash(newPass, salt);
        const data = await db.user.update({
            where: {id, resetPasswordToken: token},
            data: {password: securePass}
        })
        if(!data) return {success: false, message: 'Bad request!'}
        return {success: true, message: "Password updated successfully!"}
    } catch (error) {
        return {success: false, message: 'server error try agan later'}
    }
}
