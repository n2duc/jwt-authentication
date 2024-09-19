/* eslint-disable no-console */
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE
  }
]

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

export const modelGemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', safetySettings })