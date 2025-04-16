import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
	try {
		const client = await clientPromise;
		const db = client.db("neuroverse");
		
		const collection = db.collection("users");
		
		const {name, email, image}: {
			name: string;
			email: string;
			image: string
		} = await req.json();
		
		const existingUser = await collection.findOne({ email: email });
    
		if (existingUser) {
			return NextResponse.json(
				{ message: "User already existing", data: existingUser },
			);
		}
		
		const newUser = {
			name,
			email,
			image,
			createdAt: new Date(),
		};
		
		const result = await collection.insertOne(newUser);

		// Then fetch data again
		const fetchUser = await collection.findOne({ email: email });
		
		return NextResponse.json(
			{ message: "User already existing", data: fetchUser },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to create user", error },
			{ status: 500 }
		);
	}
}