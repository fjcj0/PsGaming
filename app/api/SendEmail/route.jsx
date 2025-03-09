import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
export async function POST(req) {
    const { email, description } = await req.json();
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ohackerge@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD,
            }
        });
        const mailOptions = {
            from: 'ohackerge@gmail.com',
            to: email,
            subject: 'A message from ps gaming',
            html: `<h1>Hello ${email}</h1>
                   <p>We have received your report: ${description}. We will get back to you shortly.</p>
                   <h1>With appreciation</h1>`
        };
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json({ error: 'Error: ' + error.message }, { status: 400 });
    }
}