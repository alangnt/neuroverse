'use client';

import Settings from '@/components/Settings'
import Chat from '@/components/Chat'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";

import { Github } from 'lucide-react'

import { User } from '@/types/User';

// TODO: Export to a separate file
export type Tab = {
  name: string;
  value: TabValue;
}

export type TabValue = 'chat' | 'settings' | 'basicInfo' | 'interests' | 'personality' | 'other';

export default function App() {
  const {data: session, status} = useSession();

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

  const [userInfo, setUserInfo] = useState<User | null>(null);

  const fetchUserProfile = async () => {
		const data = { email: session?.user?.email };
		
		const response = await fetch("/api/users/getUser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data)
		});
		
		const result = await response.json();
		
		if (!result) {
			console.error('Failed to get user info');
		}

    setUserInfo(result.data);
	}

  useEffect(() => {
		if (status === "authenticated") {
			fetchUserProfile();
		}
	}, [status]);

  return (
    <>
      <header className={'flex flex-col items-center justify-center p-2 relative'}>
        <h1 className={'text-4xl font-bold text-gray-800'}>NeuroVerse</h1>
        <p>Speak with your own AI clones</p>

        {status === 'authenticated' ? (
          <button 
            className={'flex items-center gap-2 w-fit border rounded border-gray-200 px-3 py-2 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150 absolute right-0 top-2'}
            onClick={async () => { await signOut(); }}
          >
            <Github className={'w-4 h-4'} />
            Sign Out
          </button>
        ) : (
          <button 
            className={'flex items-center gap-2 w-fit border rounded border-gray-200 px-3 py-2 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150 absolute right-0 top-2'}
            onClick={async () => { await signIn('github'); }}
          >
            <Github className={'w-4 h-4'} />
              Sign In
          </button>
        )}
      </header>
 
      {userInfo !== null ? (
        <>
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
                <Chat userInfo={userInfo!} />
              </>
            ) : (
              <>
                <Settings userInfo={userInfo!} />
              </>
            )}
          </section>
        </>
      ) : null}
      
    </>
  )
}