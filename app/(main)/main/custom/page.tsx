 
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function CreatePartner() {
  const router = useRouter();
  const [gender, setGender] = useState<'male' | 'female' | 'none' | null>('male');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('');
  const [situation, setSituation] = useState('');

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()} className="text-xl">
          <ChevronLeftIcon className='size-6'/>
        </button>
        <h1 className=" font-semibold text-blue-500">Create</h1>
        <div className="w-6" /> 
      </div>

      {/* 폼 */}
      <div className="flex-1 px-4 pt-6 *:text-[13px] *:placeholder:text-[13px]  ">
        <h2 className="text-xl font-semibold mb-4 text-center">Set up your conversation partner</h2>

        {/* 프로필 이미지 */}
        <div className="w-24 h-24 rounded-full bg-blue-600 mx-auto" />

        {/* Name */}
        <label className="text-sm font-medium">Name</label>
       <input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full px-3 py-2 rounded mb-4  border border-gray-300 mt-2"
  placeholder="Jisoo"
/>

        {/* Gender */}
        <label className="text-sm font-medium">Gender</label>
        <div className="flex gap-2 my-2">
      {['Male', 'Female', 'None'].map((label) => {
        const value = label.toLowerCase() as 'male' | 'female' | 'none';
        const isSelected = gender === value;

        return (
          <button
            key={label}
            type='button'
            onClick={() => setGender(value)}
            className={`flex-1 btn ${
              isSelected ? 'bg-blue-600 text-white ring ring-blue-200 ' : ''
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>

        {/* Age */}
        <label className="text-sm font-medium">Age</label>
        <input
  type="number"
  value={age}
  onChange={(e) => setAge(e.target.value)}
  className="w-full px-3 py-2 rounded mb-4  border border-gray-300 mt-2"
  placeholder="48"
/>

        {/* Role */}
        <label className="text-sm font-medium">Role</label>
        <input
  type="text"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="w-full px-3 py-2 rounded mb-4  border border-gray-300 mt-2"
  placeholder="Boss"
/>

        {/* Situation */}
        <label className="text-sm font-medium">Situation</label>
        <textarea
  value={situation}
  onChange={(e) => setSituation(e.target.value)}
  className="w-full px-3 py-2 rounded mb-4  border border-gray-300 mt-2"
  placeholder="Apologizing for a mistake at work."
  rows={2}
/>
        <button 
        className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded mt-7"
        onClick={()=>router.push( `/main/custom/chatroom?name=${encodeURIComponent(name)}&gender=${gender}&age=${age}&role=${encodeURIComponent(role)}&situation=${encodeURIComponent(situation)}`)}
        >
          Start chatting
        </button>
      </div>
    </div>
  );
}
