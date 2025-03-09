import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
export async function POST(req) {
    try {
        const data = await req.json();
        const { first_name, last_name, email } = data;
        if (!first_name || !last_name || !email) {
            return NextResponse.json(
                { error: "Invalid input: all fields are required" },
                { status: 400 }
            );
        }
        const normalizedEmail = email.toLowerCase();
        const docRef = doc(db, "users", normalizedEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return NextResponse.json(docSnap.data(), { status: 200 });
        } else {
            const userData = {
                first_name: first_name,
                last_name: last_name,
                email: email,
            };
            await setDoc(docRef, userData);
            return NextResponse.json(userData, { status: 201 });
        }
    } catch (error) {
        console.log(error.stack || error.message);
        return NextResponse.json(
            { error: "Internal server error at: " + error.message },
            { status: 500 }
        );
    }
}