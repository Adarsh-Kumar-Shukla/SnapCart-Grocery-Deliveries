import connectDb from "@/lib/db";
import { s } from "motion/react-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {
    await connectDb()
    const {message, role}=await req.json()

    const prompt=`You are a professional delivery assistant chatblt.
    you will be given:
    -role: either "user" or "delivery_boy" 
    -last message: the last message sent in the conversation
    your task: 
    if role is "user"- generate 3 short Whatsapp-style reply suggestions that a user could send to the delivery boy .
    if role is "delivery_boy"- genrate 3 short Whatsapp-style reply suggestion that a delivery boy could send to the user.
    follow these rules:
    -Replies must match the context of ths lst message.
    -keep replies shorts, humar-like (max 10 words)
    -use emojis naturally max(max one per reply)
    -no generic reply "ok" or "thankyou"
    -Must be helpful , respectfull, and relevalent to delivery, status, help, or location.
    -No, numbering, no extra instruction , no extra text.
    -just return comma-separated reply suggestion.

    Return only three reply suggestion, comma-separated.
    Role:${role}
    Last Message: ${message}  `

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({
        "contents": [
      {
        "parts": [
          {
            "text": prompt
          }
        ]
      }
    ]
      })
    })

    const data=await response.json()
    const replyText=data.candidates?.[0].content.parts?.[0].text || ""
    const suggestion=replyText.split(",").map((s:string)=>s.trim())
    return NextResponse.json(
      suggestion,
      {status:200}
    )
    

  } catch (error) {
    return NextResponse.json(
      {message:`gemini error ${error}`},
      {status:500}
    )
  }
}