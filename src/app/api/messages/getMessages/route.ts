import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("neuroverse");
    const collection = db.collection("messages");

    const url = new URL(req.url);
    const user = url.searchParams.get('user');
    const botName = url.searchParams.get('botName');

    if (!user || !botName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const documents = await collection.find({ user: user, botName: botName }).toArray();

    return NextResponse.json({ message: "Success", data: documents });
  } catch (error) {
    console.error("Error fetching user's messages:", error);
    return NextResponse.json(
      { message: "Failed to find user's messages" },
      { status: 500 }
    );
  }
}
