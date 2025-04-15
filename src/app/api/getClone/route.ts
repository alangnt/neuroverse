import { NextResponse, NextRequest } from 'next/server';
import clientPromise from "@/lib/mongodb";
import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { ObjectId } from 'mongodb';
import { User } from '@/types/User';

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

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

    console.log(data)

    const objectId = new ObjectId(userInfo._id);

    const documents = await collection.find({ user: objectId, botName: botName }).toArray();

    const basePrompt = (tone: string): { model: string; messages: ChatCompletionMessageParam[] } => ({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: `You are now ${botName}, my own personal clone assistant and you'll answer all my questions like you were the ${tone} part of my emotions. Don't make the answers too long.
    Here is everything to know about me: ${JSON.stringify(userInfo, null, 2)}
    Here is the entire history of our messages in order: ${JSON.stringify(documents, null, 2)}
    Now here's my question: ${message}`
        }
      ]
    });

    // Fetch 3 emotional personas
    const [angryPersona, anxiousPersona, ambitiousPersona] = await Promise.all([
      groq.chat.completions.create(basePrompt("angry")),
      groq.chat.completions.create(basePrompt("anxious")),
      groq.chat.completions.create(basePrompt("ambitious")),
    ]);

    const personas = [
      { name: "Angrio", response: angryPersona },
      { name: "Anxi", response: anxiousPersona },
      { name: "Ambi", response: ambitiousPersona }
    ];

    const selectedPersona = personas.find((pers) => pers.name === botName);
    const botReply = selectedPersona!.response.choices?.[0]?.message?.content?.trim();

    if (!botReply) {
      return NextResponse.json({ error: "AI did not return a message" }, { status: 500 });
    }

    const newMessage = {
      user: objectId,
      role: role,
      botName: selectedPersona!.name,
      content: botReply,
      addedAt: new Date()
    };

    const result = await collection.insertOne(newMessage);

    return NextResponse.json(
      {
        message: "Message created successfully",
        documentId: result.insertedId,
        persona: selectedPersona!.name,
        reply: botReply
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting an answer", error },
      { status: 500 }
    );
  }
}
