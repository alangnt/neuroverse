'use client';

import Settings from '@/components/Settings'
import Chat from '@/components/Chat'

import { useState } from 'react'

// TODO: Export to a separate file
export type Tab = {
  name: string;
  value: TabValue;
}

export type TabValue = 'chat' | 'settings' | 'basicInfo' | 'interests' | 'personality' | 'other';

export default function App() {
  const [selectedTab, setSelectedTab] = useState<TabValue>('settings');

  const tabs: Tab[] = [
    {
      name: 'Chat',
      value: 'chat'
    },
    {
      name: 'Settings',
      value: 'settings'
    }
  ]

  return (
    <>
      <header className={'flex flex-col items-center justify-center p-2'}>
        <h1 className={'text-4xl font-bold text-gray-800'}>Neuro Pilot</h1>
        <p>Speak with your own AI clones</p>
      </header>
 
      <nav className={'flex bg-gray-100 rounded p-1 my-8'}>
        {tabs.map((tab, index) => (
          <div key={index} onClick={() => setSelectedTab(tab.value)} className={`
            flex items-center justify-center text-center w-full p-1 cursor-pointer transition-all duration-250 
            ${selectedTab === tab.value ? 'bg-white text-gray-600 rounded' : 'text-gray-400'}
          `}>
            <h2 className={'font-semibold'}>{tab.name}</h2>
          </div>
        ))}
      </nav>

      <section className='w-full grow'>
        {selectedTab === 'chat' ? (
          <>
            <Chat />
          </>
        ) : (
          <>
            <Settings />
          </>
        )}
      </section>
    </>
  )
}