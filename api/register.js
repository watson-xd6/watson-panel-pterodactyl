import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });

    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields required.' });

    const existingUser = await kv.get(`user:${username}`);
    if (existingUser) return res.status(409).json({ message: 'Username already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    await kv.set(`user:${username}`, { username, email, password: hashed, role: 'free' });

    return res.status(201).json({ message: 'Registration successful!' });
}
