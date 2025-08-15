import mongoose, { Schema, models, model } from 'mongoose';

const todoSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default models.Todo || model('Todo', todoSchema);
