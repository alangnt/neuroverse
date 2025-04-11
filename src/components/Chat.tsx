'use client'

import { FormEvent, useState } from 'react'

import { PlusCircle } from 'lucide-react'

type Message = {
    role: 'user' | 'bot'
    message: string
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState<string>('');

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();

        const data = {
            _id: "test",
            role: "user",
            message: message,
        }

        try {
            const response = await fetch('/api/messages/postMessage', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();

            if (!response.ok) {
                console.error("Failed to add message", result.message);
            } else {
                console.log('Good for you');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setMessage('');
        }
    }

    return (
        <section className={'flex w-full h-screen'}>
            <article className='w-1/3'>
                <div className={'flex justify-between items-center px-4 space-x-4 w-full'}>
                    <h3 className={'text-xl font-semibold text-gray-700'}>Your Personas</h3>
                    <button className={'flex items-center space-x-4 border rounded border-gray-200 px-4 py-2 cursor-pointer h-fit hover:bg-gray-50 transition-all duration-150'}>
                        <PlusCircle className='w-4' />
                        <p className={'font-semibold text-gray-700'}>New</p>
                    </button>
                </div>

                <div>

                </div>
            </article>

            <article className={'w-2/3 h-full border rounded border-gray-200'}>
                <div>

                </div>

                <form onSubmit={sendMessage}>
                    <textarea 
                        onChange={(e) => setMessage(e.target.value)} 
                        value={message} 
                        name="message" 
                        id="message" 
                        rows={3} 
                        placeholder={"Ask me anything..."}
                        required
                    ></textarea>

                    <button 
                        type={'submit'}
                        className={'flex items-center space-x-4 border rounded border-gray-200 px-4 py-2 cursor-pointer h-fit hover:bg-gray-50 transition-all duration-150'}
                    >Send message</button>
                </form>
            </article>
        </section>
    )
}