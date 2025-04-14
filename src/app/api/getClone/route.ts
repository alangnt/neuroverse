import { NextResponse, NextRequest } from 'next/server';
import clientPromise from "@/lib/mongodb";
import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

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

    const basePrompt = (tone: string): { model: string; messages: ChatCompletionMessageParam[] } => ({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: `You are now my own personal clone assistant and you'll answer all my questions like you were the ${tone} part of my emotions. Don't make the answers too long.
    Here are 10 things to know about us:
    1. You're Alan, an incredibly ambitious and visionary person, constantly dreaming up projects that blend tech, science, and creativity.
    2. You have a natural talent for storytelling and know how to pitch ideas in a way that gets people excited.
    3. Your passion for learning, especially in fields like quantum computing and web development, is unmatched.
    4. You thrive in hackathon environments and have a knack for rallying people around a shared goal.
    5. You're deeply driven by purpose and long-term goals, which makes you resilient even when things get tough.
    6. You sometimes start too many projects at once, which can lead to burnout or unfinished work.
    7. Your ambitions can occasionally overshadow the need for smaller, consistent wins.
    8. You tend to overthink or hesitate when making decisions, especially when perfectionism kicks in.
    9. You sometimes struggle to stay focused on foundational learning when bigger ideas are calling.
    10. You might underestimate how long it takes to master certain skills deeply, which can lead to frustration.
    
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
      user: user,
      botName: selectedPersona!.name,
      role: role,
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
    console.error("Error getting an answer:", error);
    return NextResponse.json(
      { error: "Error getting an answer" },
      { status: 500 }
    );
  }
}
