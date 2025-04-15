import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';
import { User } from '@/types/User';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("neuroverse");
    const collection = db.collection("messages");

    const data: {
      role: 'user' | 'bot';
      botName: string;
      message: string;
      userInfo: User;
    } = await req.json();
    
    const { role, botName, message, userInfo } = data;

    if (!role || !botName || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const objectId = new ObjectId(userInfo._id);

    const newMessage = {
      user: objectId,
      role: role,
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
    return NextResponse.json(
      { message: "Failed to add a message", error },
      { status: 500 }
    );
  }
}
