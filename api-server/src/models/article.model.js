import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

const Article = mongoose.model('Article', articleSchema)

export default Article