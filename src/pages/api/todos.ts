import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Todo from '@/models/Todo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    // Get all todos
    const todos = await Todo.find().sort({ createdAt: -1 });
    return res.status(200).json(todos);
  }

  if (req.method === 'POST') {
    // Create a new todo
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }
    const todo = await Todo.create({ text });
    return res.status(201).json(todo);
  }

  if (req.method === 'DELETE') {
    // Delete a todo by id
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    await Todo.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
