import { signIn } from "next-auth/react";

import { Dispatch, SetStateAction } from "react"

import { LucideIcon, Github, ChevronRight, User, Users, MessageSquare } from 'lucide-react'
import { TabValue } from "@/app/page";

type Card = {
  icon: LucideIcon;
  title: string;
  description: string;
}

type PersonaCard = {
  title: string;
  description: string;
  color: string;
}

interface Props {
  setSelectedTab: Dispatch<SetStateAction<TabValue>>;
  status: string;
}

export default function LandingPage({ setSelectedTab, status }: Props) {
  const cards: Card[] = [
    {
      icon: User,
      title: "Add Your Info",
      description: "Share some basic information about yourself, your interests, and your personality traits"
    },
    {
      icon: Users,
      title: "Choose a Persona",
      description: "Select from up to 7 preset personas like Ambitious, Astra, Mira, or Echo"
    },
    {
      icon: MessageSquare,
      title: "Start Chatting",
      description: "Have meaningful conversations with different versions of yourself based on your personal information"
    }
  ]

  const personas: PersonaCard[] = [
    {
      title: "Astra, the Ambitious You",
      description: "Always aiming high, Astra focuses on productivity, career goals, and exponential growth. Think 10x mindset, startup grind, and laser focus",
      color: "bg-amber-100"
    },
    {
      title: "Nox, the Shadow You",
      description: "The part of you that voices doubts, fears, or anxieties. Nox isn't negative... it's protective. It warns you of potential failure and emotional burnout",
      color: "bg-violet-100"
    },
    {
      title: "Iris, the Creative Spark",
      description: "Iris fuels artistic bursts, unexpected ideas, and curious tangents. When you want to brainstorm or break out of patterns, Iris is your guide",
      color: "bg-cyan-100"
    },
    {
      title: "And so on...",
      description: "Connect now to meet all of your 7 own personas, each completely unique and particular",
      color: "bg-red-100"
    }
  ]

  return (
    <>
      <main className="flex flex-col grow">
        <section className={'flex flex-col space-y-4 justify-center items-center px-8 py-12 text-center'}>
          <h3 className={'text-4xl font-semibold'}>Discover Different Sides of Yourself</h3>
          <p className={'text-xl text-gray-600 mb-12 px-8'}>Chat with AI-generated personas based on your personality. Get advice from your ambitious self, challenge your thinking with your logical self, or explore your creative side</p>

          {status === 'authenticated' ? (
            <button 
              className={'flex items-center gap-2 w-fit border rounded border-gray-200 px-4 py-3 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150'}
              onClick={() => setSelectedTab('chat')}
            >
              Chat Now
            </button>
          ) : (
            <>
              <div className={'flex space-x-4'}>
                <button 
                  className={'flex items-center gap-2 w-fit border rounded border-gray-200 px-4 py-3 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150'}
                  onClick={async () => { await signIn('github'); }}
                >
                  <Github className={'w-4 h-4'} />
                  Sign In
                </button>

                <button 
                  className={'flex items-center gap-2 w-fit border rounded border-gray-200 px-4 py-3 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150'}
                  onClick={() => setSelectedTab('chat')}
                >
                  Try It Out
                </button>
              </div>

              <div>
                <p className={'text-sm text-red-800 text-center mt-4'}>Disclaimer: If you try NeuroVerse without an account, any data entered can be subject to a loss when refreshing the page</p>
              </div>
            </>
          )}
          
        </section>

        <section className={'flex flex-col space-y-16 bg-gray-50 py-18 px-12'}>
          <h3 className={'text-4xl font-semibold text-center'}>How It Works</h3>

          <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
            {cards.map((card, index) => (
              <article key={index} className={'flex flex-col space-y-4 border border-gray-200 rounded px-4 py-8 shadow bg-background'}>
                <div className={'flex space-x-4 items-center'}>
                  <div className={'flex items-center justify-center bg-gray-100 rounded-full p-2 w-12 h-12'}><card.icon className={'w-6 h-6'} /></div>
                  <h4 className={'text-2xl font-semibold'}>{card.title}</h4>
                </div>
                <p className={'text-lg text-gray-600 px-2'}>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={'flex flex-col space-y-16 py-18 px-12'}>
          <h3 className={'text-4xl font-semibold text-center'}>Meet Your Personas</h3>

          <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>
            {personas.map((persona, index) => (
              <article key={index} className={'flex flex-col space-y-4 border border-gray-200 rounded shadow bg-background'}>
                <span className={`h-2 ${persona.color}`}></span>

                <div className={'flex flex-col px-4 pb-8'}>
                  <h4 className={'text-lg font-semibold'}>{persona.title}</h4>
                  <p className={'text-sm text-gray-600'}>{persona.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={'flex flex-col space-y-4 justify-center items-center px-8 py-12 text-center bg-gray-50'}>
          <h3 className={'text-4xl font-semibold'}>Ready to Meet Yourself?</h3>
          <p className={'text-xl text-gray-600 mb-12'}>Gain new perspectives, challenge your thinking, and discover insights about yourself through conversations with your different personas</p>
          
          {status === 'authenticated' ? (
            <button 
              className={'flex items-center gap-2 w-fit border rounded border-gray-200 px-4 py-3 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150'}
              onClick={() => setSelectedTab('chat')}
            >
              Chat Now
            </button>
          ) : (
            <button 
              className={'flex items-center gap-2 w-fit border rounded border-gray-200 px-4 py-3 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150'}
              onClick={async () => { await signIn('github'); }}
            >
              <Github className={'w-4 h-4'} />
              Get Started Now
              <ChevronRight className={'w-4 h-4'} />
            </button>
          )}
          
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto px-4 text-center text-gray-700">
          <p>© {new Date().getFullYear()} NeuroVerse. All rights reserved.</p>
          <p className="text-sm mt-2">Your data stays on secure databases and is never shared.</p>
        </div>
      </footer>
    </>
  )
}