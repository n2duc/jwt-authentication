import mongoose from 'mongoose'

let profile_imgs_name_list = ['Garfield', 'Tinkerbell', 'Annie', 'Loki', 'Cleo', 'Angel', 'Bob', 'Mia', 'Coco', 'Gracie', 'Bear', 'Bella', 'Abby', 'Harley', 'Cali', 'Leo', 'Luna', 'Jack', 'Felix', 'Kiki']
let profile_imgs_collections_list = ['notionists-neutral', 'adventurer-neutral', 'fun-emoji']

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    public_id: {
      type: String
    },
    url: {
      type: String,
      default: () => {
        return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
      }
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User