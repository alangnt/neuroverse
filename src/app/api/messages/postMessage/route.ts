import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("neuroverse");
    const collection = db.collection("messages");

    const { user, role, botName, message }: {
      user: string;
      role: 'user' | 'bot';
			botName: string;
      message: string;
    } = await req.json();

    if (!user || !role || !botName || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newMessage = {
      user,
      role,
			botName: botName,
      content: message,
      addedAt: new Date(),
    };

    const result = await collection.insertOne(newMessage);

    return NextResponse.json(
      { message: "Message created successfully", documentId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { message: "Failed to add a message", error },
      { status: 500 }
    );
  }
}
