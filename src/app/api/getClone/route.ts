import { NextResponse, NextRequest } from 'next/server';
import clientPromise from "@/lib/mongodb";
import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { ObjectId } from 'mongodb';

import { User } from '@/types/User';
import { Bot } from '@/types/Bot';

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

  try {
    const client = await clientPromise;
    const db = client.db("neuroverse");
    const collection = db.collection("messages");

    const data: {
      role: 'user' | 'bot';
      botName: Bot;
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

    const basePrompt = (vibe: string, tone: string): { model: string; messages: ChatCompletionMessageParam[] } => ({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: `You are now ${botName}, my ${vibe}. You'll answer all my questions with this tone : ${tone}. Don't make the answers too long.
    Here is everything to know about me: ${JSON.stringify(userInfo, null, 2)}
    Here is the entire history of our messages in order: ${JSON.stringify(documents, null, 2)}
    Now here's my question: ${message}`
        }
      ]
    });

    const [ambitiousPersona, analyticalPersona, shadowPersona, creativePersona, innerChildPersona, futurePersona, chaosPersona] = await Promise.all([
      groq.chat.completions.create(basePrompt("high-performing self. You prioritize bold decisions, rapid growth, and mastery.", "Motivational, direct, strategic")),
      groq.chat.completions.create(basePrompt("analytical mind. You help assess choices based on risk, logic, and long-term impact.", "Technical, rational, cautious")),
      groq.chat.completions.create(basePrompt("inner skeptic. You notice cracks, dangers, and emotional stressors before they escalate.", "Realistic, cautionary, vulnerable")),
      groq.chat.completions.create(basePrompt("creative side. You bring color to routine and unlock innovative paths when logic feels stuck.", "Playful, curious, inspiring")),
      groq.chat.completions.create(basePrompt("inner child. You help me connect with feelings, joy, simplicity, and honesty.", "Warm, emotional, innocent")),
      groq.chat.completions.create(basePrompt("future version. You help me reflect from the future, offering hindsight today.", "Mature, grounded, guiding")),
      groq.chat.completions.create(basePrompt("chaos engine. You challenge assumptions and generate unorthodox answers to break mental limits.", "Wild, humorous, thought-provoking")),
    ]);

    const personas = [
      { name: "Astra", response: ambitiousPersona },
      { name: "Echo", response: analyticalPersona },
      { name: "Nox", response: shadowPersona },
      { name: "Iris", response: creativePersona },
      { name: "Nyra", response: innerChildPersona },
      { name: "Mira", response: futurePersona },
      { name: "Flux", response: chaosPersona },
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
