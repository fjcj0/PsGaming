import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { NextResponse } from "next/server";
export async function POST(req) {
    try {
        const { name, description, images, background, video, rate, type } = await req.json();
        const newGameRef = doc(db, "games", name);
        const gameData = {
            name: name,
            description: description,
            background: background,
            video: video,
            rate: rate,
            type: type,
            images: images,
            createdAt: new Date(),
        };
        await setDoc(newGameRef, gameData);
        return NextResponse.json({ message: "Game added successfully!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add game: " + error.message }, { status: 500 });
    }
}