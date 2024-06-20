import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {
        // const { username, email, password, isAcceptingMessage } = await request.json();
        const { username, email, password } = await request.json();
    } catch (error) {
        console.log('Error Registering User', error);
        return Response.json({
            success: false,
            message: "Error Registering User"
        }, { status: 500 });
    }
}