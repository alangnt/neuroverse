import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("neuroverse");
    const collection = db.collection("messages");

    const url = new URL(req.url);
    const userId = url.searchParams.get('id');
    const botName = url.searchParams.get('botName');

    if (!userId || !botName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const objectId = new ObjectId(userId);

    const documents = await collection.find({ user: objectId, botName: botName }).toArray();

    return NextResponse.json({ message: "Success", data: documents });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to find user's messages", error },
      { status: 500 }
    );
  }
}
