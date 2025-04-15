import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("neuroverse");
    const collection = db.collection("users");

    const { _id, hobbies, goals, values }: {
      _id: string;
      hobbies: string;
			goals: string;
      values: string;
    } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { message: "Id is required" },
        { status: 400 }
      );
    }

    const updatedInfo = {
      hobbies: hobbies,
			goals: goals,
      values: values
    };

    const objectId = new ObjectId(_id);

    const result = await collection.updateOne(
			{ _id: objectId },
			{ $set: updatedInfo }
		);

    return NextResponse.json(
      { message: "Informations updated successfully", documentId: result },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating informations", error },
      { status: 500 }
    );
  }
}
