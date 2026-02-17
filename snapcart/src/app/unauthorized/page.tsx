'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
  const router = useRouter()
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100' >
      <h1 className='text-4xl font-bold text-red-600' >Access Denied: ⛔</h1>
      <p className='text-2xl mt-2 text-gray-700' >You cannot Access this page.</p>
      <button 
        onClick={()=>router.push("/")}
        className='text-md px-4 py-2 mt-10 font-semibold border border-green-800 bg-white text-green-700 hover:bg-green-700 hover:text-white  rounded-full hover:scale-110 transition-all duration-400 '
      >Go To Home</button>
    </div>
  )
}

export default page
