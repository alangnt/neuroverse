'use client'

import { FormEvent, useEffect, useState, useRef } from 'react'
import { PlusCircle } from 'lucide-react'

import { User } from '@/types/User'
import { Persona } from '@/types/Bot';
import Image from 'next/image';

interface Props {
  userInfo: User;
}

// TODO: Separate file with the types
export type Message = {
  name?: string;
  role: 'user' | 'bot';
  content: string;
  botName?: string;
}

export default function Chat({ userInfo }: Props) {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPersonaMessages, setSelectedPersonaMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const basePersonas: Omit<Persona, 'messages'>[] = [
    { name: 'Astra', tone: 'Motivational, direct, strategic', image: "/Astra.png" }, 
    { name: 'Echo', tone: 'Nervous, introspective, tentative', image: "/Echo.png" }, 
    { name: 'Nox', tone: 'Realistic, cautionary, vulnerable', image: "/Nox.png" }, 
    { name: 'Iris', tone: 'Playful, curious, inspiring', image: "/Iris.png" }, 
    { name: 'Nyra', tone: 'Warm, emotional, innocent', image: "/Nyra.png" }, 
    { name: 'Mira', tone: 'Mature, grounded, guiding', image: "/Mira.png" }, 
    { name: 'Flux', tone: 'Wild, humorous, thought-provoking', image: "/Flux.png" }
  ];

  const personas: Persona[] = basePersonas.map(p => ({
    ...p,
    messages: messages.filter(msg => msg.botName === p.name)
  }));

  const [persona, setPersona] = useState<string>(personas[0].name);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/getMessages?id=${userInfo._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Failed to retrieve messages');

      const data = await res.json();
      setMessages(data.data);
      setSelectedPersonaMessages(data.data.filter((msg: Message) => msg.botName === persona));
    } catch (err) {
      console.error('Error retrieving messages:', err);
    }
  }

  const sendMessage = async () => {
    const data = {
      role: "user",
      botName: persona,
      message: message,
      userInfo
    }

    const newUserMessage: Message = {
      role: 'user',
      content: message,
      botName: persona,
      name: userInfo.name,
    };

    setSelectedPersonaMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/messages/postMessage', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to add message", result.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const messageBot = async () => {
    try {
      const data = {
        role: "bot",
        botName: persona,
        message: message,
        userInfo
      }

      const res = await fetch('/api/getClone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to send message');
    } catch (err) {
      console.error('Error sending message to bot:', err);
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (message.length === 0) return;

    setIsLoading(true);

    try {
      await sendMessage();
      await messageBot();
      await fetchMessages();
    } catch (error) {
      console.error(error);
    } finally {
      setMessage('');
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchMessages();
    }, 1000)
  }, [persona]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedPersonaMessages]);

  return (
    <section className={'flex max-md:flex-col-reverse max-md:gap-4 grow md:space-x-4 w-full relative mb-8'}>
      <article className='flex flex-col space-y-4 md:w-1/3'>
        <div className={'flex justify-between items-center space-x-4'}>
          <h3 className={'text-xl font-semibold text-gray-700'}>Your Personas</h3>
          <button className={'flex items-center space-x-2 border rounded border-gray-200 px-3 py-1 cursor-pointer hover:bg-gray-50 transition-all duration-150'}>
            <PlusCircle className='w-4' />
            <p className={'font-semibold text-gray-700'}>New</p>
          </button>
        </div>

        <div className={'grid grid-cols-3 max-md:gap-4 md:flex md:flex-col md:space-y-4'}>
          {personas.map((pers, index) => (
            <div
            key={index}
            onClick={() => setPersona(pers.name)}
            className={`w-full border rounded cursor-pointer hover:bg-gray-50 transition-all duration-150 p-4 ${pers.name === persona ? 'bg-gray-100 border-gray-400' : ' border-gray-200'}`}
            >
              <p className={'font-semibold'}>{pers.name}</p>
              <p className="text-xs text-gray-500">{pers.tone}</p>
              <p className="text-xs text-gray-500 italic mt-2 truncate">
                {pers.messages.length > 0 ? pers.messages[pers.messages.length - 1].content : 'No messages yet.'}
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className="flex flex-col md:w-2/3 h-[calc(100vh-215px)] md:h-[calc(100vh-200px)] border rounded border-gray-200 md:sticky md:right-0 md:top-0">
        <div className={'flex items-center justify-between border-b border-gray-200 p-4'}>
          <div>
            <p className={'text-xl font-semibold'}>{persona}</p>
            <p className={'text-sm text-gray-500'}>
              {personas.find(p => p.name === persona)?.tone}
            </p>
          </div>
         
          <div className='rounded-full overflow-hidden'>
            <Image src={personas.find(p => p.name === persona)?.image || ''} alt={personas.find(p => p.name === persona)?.name || ''} width={50} height={50} />
          </div>
        </div>
        
        <div className="flex flex-col grow p-4 overflow-y-auto">
          {selectedPersonaMessages.map((msg, index) => (
            <div key={index} className={`mb-4 p-3 rounded ${msg.role === 'user' ? 'bg-blue-100 text-left' : 'bg-green-100 text-right'}`}>
              <p className="text-sm text-gray-600 italic">{msg.role === 'user' ? 'You' : msg.name || msg.botName ? msg.botName : 'Bot'}</p>
              <p className="text-gray-800">{msg.content}</p>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className={'flex space-x-4 p-4'}>
          <input 
            type={'text'}
            onChange={(e) => setMessage(e.target.value)}
            className={'w-full px-4 py-2 border rounded border-gray-300'}
            value={message} 
            name="message" 
            id="message" 
            placeholder={"Ask me anything..."}
            required
          />

          <button 
            type={'submit'}
            disabled={isLoading}
            className={'flex items-center space-x-2 border rounded border-gray-300 px-4 py-2 bg-white hover:bg-gray-100 transition-all duration-150'}
          >
            {isLoading ? (
              <span className="animate-spin rounded-full w-4 h-4 border-t-2 border-gray-500"></span>
            ) : (
              <p>Send</p>
            )}
          </button>
        </form>
      </article>
    </section>
  );
}
