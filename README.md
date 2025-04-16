# 🌌 NeuroVerse

**Navigate your life with AI-powered versions of yourself.**

NeuroVerse is an experimental productivity tool where emotional AI personas - like Ambitious You, Creative You, and Future You — help you explore your goals, make decisions, and reflect on your path through different mindsets.

Each digital persona uses your past context, goals, and message history to respond with a tone and perspective that mirrors your inner multiverse.

This project was made as part of the [Next.js](https://nextjs.org/) hackathon that took part from April 7 to April 17, 2025.

---

## 🧠 Key Features

- **AI Personas**  
  7 custom-designed personas (Astra, Iris, Nox, etc.), each with unique tone and cognitive approach.

- **Dynamic Prompt Injection**  
  Your personal data (message history, user info, current question) is used to generate rich, context-aware replies.

- **Multi-Persona Replies**  
  Ask a question once, and receive multiple answers — each from a different “you.”

- **MongoDB Message Storage**  
  Saves all user + bot interactions, linked by persona, for future reflection and AI memory.

---

## 🧬 Tech Stack

| Layer           | Stack |
|------------------|--------------------------|
| **Frontend**     | Next.js 15 + TailwindCSS + App Router |
| **Backend**      | Next.js API routes (`/app/api`) using TypeScript |
| **Database**     | MongoDB (with native driver + `ObjectId`) |
| **AI Layer**     | [Groq SDK](https://groq.com/) via Vercel x Groq integration using **LLaMA 3 70B** |
| **Hosting**      | Vercel |
| **Prompt Strategy** | Persona-based system prompts + message context injection |

---

## 🧪 Personas

| Name   | Role              | Tone                     |
|--------|-------------------|--------------------------|
| Astra  | Ambitious Self    | Motivational, strategic  |
| Echo   | Indecisive Self   | Nervous, hesitant        |
| Nox    | Shadow/Skeptic    | Cautionary, realistic    |
| Iris   | Creative Self     | Playful, expressive      |
| Nyra   | Inner Child       | Warm, joyful             |
| Mira   | Future Self       | Grounded, wise           |
| Flux   | Chaos Engine      | Wild, unorthodox         |

---

## 🔧 Example Prompt Logic

```ts
content: `
You are now ${botName}, my ${vibe}. 
You’ll answer with this tone: ${tone}. 
Don't make answers too long. 
Here’s everything to know about me: ${userInfo}
Here’s the message history: ${documents}
Now answer this question: ${message}
`
