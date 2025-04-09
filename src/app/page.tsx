'use client';

import { useState } from 'react';

export default function App() {
  const [message, setMessage] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    setIsLoading(true);

    try {
        const res = await fetch('/api/getClone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        setMessage('');

        if (!res.ok) throw new Error('Failed to send message');

        const data = await res.json();
        setAnswer(data.activity);
    } catch (err) {
        console.error('Error generating activity:', err);
        setAnswer('Something went wrong!');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Neuro Pilot</h1>
      <p>Speak with your own AI clones</p>

      <form onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}>
        <label htmlFor="message">Enter a message for your clone</label>
        <input type="text" id="message" value={message} onChange={(e) => setMessage(e.target.value)} />

        <button disabled={isLoading} type="submit">
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      
      {answer && (
        <p className="text-sm text-gray-500 mt-4">{answer}</p>
      )}
    </div>
  )
}