import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {
        // const { username, email, password, isAcceptingMessage } = await request.json();
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVefined: true });

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email",
                }, { status: 400 })
            } else {
                // user has created the account but is not verified -> may be he wants to update the password also
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            // means the user is new and is visiting the website first time
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }

        // send Verification Email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "User registered successfully, Please verify your Email.",
        }, { status: 201 });

    } catch (error) {
        console.log('Error Registering User', error);
        return Response.json({
            success: false,
            message: "Error Registering User"
        }, { status: 500 });
    }
}