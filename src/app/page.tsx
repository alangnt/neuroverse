'use client';

import Settings from '@/components/Settings'
import Chat from '@/components/Chat'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";

import { ChevronLeft, Github } from 'lucide-react'

import { User } from '@/types/User';
import LandingPage from '@/components/LandingPage';

// TODO: Export to a separate file
export type Tab = {
  name: string;
  value: TabValue;
}

export type TabValue = 'landing' | 'chat' | 'settings' | 'basicInfo' | 'interests' | 'personality' | 'other';

export default function App() {
  const {data: session, status} = useSession();

  const [publicUser, setPublicUser] = useState<string>('');

  const [selectedTab, setSelectedTab] = useState<TabValue>('landing');

  const tabs: Tab[] = [
    {
      name: 'Chat',
      value: 'chat'
    },
    {
      name: 'Informations',
      value: 'settings'
    }
  ]

  const [userInfo, setUserInfo] = useState<User | null>(null);

  const fetchUserProfile = async () => {
    let data;

    if (!session) {
      data = { email: publicUser }
    } else {
      data = { name: session?.user?.name, email: session?.user?.email, image: session?.user?.image };
    }
		
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
    if (!session) {
      const stored = localStorage.getItem("guestEmail");
      if (stored) {
        setPublicUser(stored);
      } else {
        const id = Math.floor(Math.random() * 900000000000000 + 100000000000000);
        const email = `guest-${id}@neuroverse.ai`;
        localStorage.setItem("guestEmail", email);
        setPublicUser(email);
      }
    }
  
    fetchUserProfile();
  }, [status]);

  return (
    <>
      <header className={'flex flex-col items-center justify-center bg-background p-2 relative max-md:sticky max-md:top-0 z-10 border-b border-gray-200'}>
        {selectedTab !== 'landing' && (
          <button 
          className={'flex items-center gap-2 w-fit border rounded border-gray-200 p-2 cursor-pointer bg-gray-100 text-gray-50 hover:bg-gray-50 transition-all duration-150 md:absolute left-2 md:top-2'}
          onClick={() => setSelectedTab('landing')}
          >
          <ChevronLeft className={'w-4 h-4 text-black'} />
          </button>
        )}
       
        <h1 className={'text-4xl font-bold text-gray-800'}>NeuroVerse</h1>
        {status === 'authenticated' && (
          <p className={'max-md:hidden'}>Speak with your own AI clones</p>
        )}

        {status === 'authenticated' && (
          <button 
            className={'flex items-center gap-2 w-fit border rounded border-gray-200 px-3 py-2 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150 md:absolute right-2 md:top-2'}
            onClick={async () => { await signOut(); }}
          >
            <Github className={'w-4 h-4'} />
            Sign Out
          </button>
        )}

        {status === 'unauthenticated' && selectedTab !== 'landing' && (
          <button 
            className={'flex items-center gap-2 w-fit border rounded border-gray-200 px-3 py-2 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150 md:absolute right-2 md:top-2'}
            onClick={async () => { await signIn(); }}
          >
            <Github className={'w-4 h-4'} />
            Sign In
          </button>
        )}
      </header>

      {status === 'loading' ? (
        <>
          <p className='text-lg text-gray-400 text-center'>Personas are waking up...</p>
        </>
      ) : (
        <>
          {selectedTab !== 'landing' ? (
            <>
              {userInfo !== null ? (
                <main className="flex flex-col grow h-full flex-1 px-4 lg:px-12">
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
    
                  <section className='flex-grow flex flex-col w-full h-full'>
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
                </main>
              ) : (
                <div className='flex justify-center text-center p-4 w-full'>
                  <p>Loading account data...</p>
                </div>
              )}
            </>
          ) : (
          <LandingPage setSelectedTab={setSelectedTab} status={status} />
          )}
        </>
      )}
    </>
  )
}