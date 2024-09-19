import { StatusCodes } from 'http-status-codes'
import ChatHistory from '~/models/chatHistory.model'
import { modelGemini } from '~/services/gemini'

const generateContent = async (req, res) => {
  try {
    const chat = modelGemini.startChat({
      history: req.body.history,
      generationConfig: {
        maxOutputTokens: 500
      }
    })

    const result = await chat.sendMessage(req.body.prompt)
    const response = await result.response
    const text = response.text()
    res.status(StatusCodes.OK).json({ text })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params
    const userChat = await ChatHistory.findOne({ userId })

    if (!userChat) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Chat history not found' })
    }

    res.status(StatusCodes.OK).json({ userChat })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

export const geminiController = {
  generateContent,
  getChatHistory
}