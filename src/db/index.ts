import mongoose, { model, Schema } from 'mongoose'
import { boolean } from 'zod'

const UserSchema = new Schema({
  email: { type: String, require: true, unique: true },
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
})

const TagSchema = new Schema({
  title: { type: String, require: true, unique: true }
})

//types of content that can be added
const contentTypes = ['image', 'video', 'article', 'audio']

const ContentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'tags' }],
  date: Date,
  userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true }
})

const LinkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
})

export const UserModel = model('users', UserSchema)
export const ContentModel = model('contents', ContentSchema)
export const TagModel = model('tags', TagSchema)
export const LinkModel = model('links', LinkSchema)
