'use client'

import { FormEvent, useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'

// TODO: Separate file with the types
export type Message = {
  name?: string;
  role: 'user' | 'bot';
  content: string;
  botName?: string;
}

export default function Chat() {
  const personas = ['Angrio', 'Anxi', 'Ambi'];

  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [persona, setPersona] = useState<string>(personas[0]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/getMessages?user=${'Alan'}&botName=${persona}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Failed to retrieve messages');

      const data = await res.json();
      setMessages(data.data);
    } catch (err) {
      console.error('Error retrieving messages:', err);
    }
  }

  const sendMessage = async () => {
    const data = {
      user: "Alan",
      role: "user",
      botName: persona,
      message: message,
    }

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
        user: "Alan",
        role: "bot",
        botName: persona,
        message: message,
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
      setTimeout(() => {
        setMessage('');
        setIsLoading(false);
      }, 1000);
    }
  }

  // 🧠 Top-level useEffect to fetch on load
  useEffect(() => {
    fetchMessages();
  }, [persona]);

  return (
    <section className={'flex space-x-4 w-full overflow-hidden'}>
      <article className='flex flex-col space-y-4 w-1/3'>
        <div className={'flex justify-between items-center space-x-4'}>
          <h3 className={'text-xl font-semibold text-gray-700'}>Your Personas</h3>
          <button className={'flex items-center space-x-2 border rounded border-gray-200 px-3 py-1 cursor-pointer hover:bg-gray-50 transition-all duration-150'}>
            <PlusCircle className='w-4' />
            <p className={'font-semibold text-gray-700'}>New</p>
          </button>
        </div>

        <div className={'flex flex-col space-y-4'}>
          {personas.map((pers, index) => (
            <div
            key={index}
            onClick={() => setPersona(pers)}
            className={`w-full border rounded border-gray-200 cursor-pointer hover:bg-gray-50 transition-all duration-150 p-4 ${pers === persona ? 'bg-gray-100' : ''}`}
            >
              <p>{pers}</p>
            </div>
          ))}
        </div>
      </article>

      <article className={'flex flex-col w-2/3 h-[70vh] border rounded border-gray-200'}>
        <div className={'flex flex-col grow p-4 overflow-y-auto'}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 p-3 rounded ${msg.role === 'user' ? 'bg-blue-100 text-left' : 'bg-green-100 text-right'}`}>
              <p className="text-sm text-gray-600 italic">{msg.role === 'user' ? 'You' : msg.name || msg.botName ? msg.botName : 'Bot'}</p>
              <p className="text-gray-800">{msg.content}</p>
            </div>
          ))}
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
