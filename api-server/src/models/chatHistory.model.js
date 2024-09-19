import mongoose from 'mongoose'

const chatHistorySchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  history: [
    {
      role: { type: String },
      parts: [
        {
          text: String
        }
      ]
    }
  ]
}, { timestamps: true })

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema)

export default ChatHistory