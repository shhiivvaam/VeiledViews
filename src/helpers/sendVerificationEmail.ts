import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Veiled Views | Verification Email',
            react: VerificationEmail({ username, otp: verifyCode })
        });
        return {
            success: true,
            message: 'Verification Email sent Successfully'
        }
    } catch (emailError) {
        console.log('Error Sending Verification Email', emailError);
        return {
            success: false,
            message: 'Failed to Send Verification Email'
        }
    }
}