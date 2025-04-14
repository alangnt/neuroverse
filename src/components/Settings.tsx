'use client'

import { useState } from 'react'
import { Tab, TabValue } from '@/app/page';

import BasicInfoForm from './forms/BasicInfo';
import InterestsForm from './forms/Interests';
import PersonalityForm from './forms/Personality';
import OtherForm from './forms/Other';

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState<TabValue>('basicInfo');
  
    const tabs: Tab[] = [
      { name: 'Basic Info', value: 'basicInfo' },
      { name: 'Interests & Goals', value: 'interests' },
      { name: 'Personality', value: 'personality' },
      { name: 'Other', value: 'other' }
    ]

    const [basicInfo, setBasicInfo] = useState({ name: '', age: '', location: '', occupation: '' });
    const [interests, setInterests] = useState({ hobbies: '', goals: '', values: '' });
    const [personality, setPersonality] = useState({ personality: '', strengths: '', weaknesses: '' });
    const [other, setOther] = useState({ notes: '' });

  return (
    <section className={'flex flex-col space-y-4 w-full overflow-hidden border rounded border-gray-200 p-4'}>
      <article>
        <h3 className={'text-2xl font-semibold text-gray-900'}>Personal Information</h3>
        <p className={'text-sm text-gray-500'}>Add details about yourself to make your AI personas more personalized.</p>
        <p className={'text-sm text-gray-500'}>This information is stored locally and never shared.</p>
      </article>

      <nav className={'flex bg-gray-100 rounded p-1'}>
        {tabs.map((tab, index) => (
          <div key={index} onClick={() => setSelectedTab(tab.value)} className={`
            flex items-center justify-center text-center w-full p-1 cursor-pointer transition-all duration-250 
            ${selectedTab === tab.value ? 'bg-white text-gray-600 rounded' : 'text-gray-400'}
          `}>
            <h2 className={'font-semibold'}>{tab.name}</h2>
          </div>
        ))}
      </nav>

      {/* Render the appropriate form */}
      {selectedTab === 'basicInfo' && (
        <BasicInfoForm formData={basicInfo} setFormData={setBasicInfo} />
      )}
      {selectedTab === 'interests' && (
        <InterestsForm formData={interests} setFormData={setInterests} />
      )}
      {selectedTab === 'personality' && (
        <PersonalityForm formData={personality} setFormData={setPersonality} />
      )}
      {selectedTab === 'other' && (
        <OtherForm formData={other} setFormData={setOther} />
      )}
    </section>
  )
}