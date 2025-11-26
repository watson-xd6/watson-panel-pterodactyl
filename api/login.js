import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });

    const { username, password } = req.body;
    const user = await kv.get(`user:${username}`);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password.' });

    // For simplicity, token = username (can replace with JWT later)
    return res.status(200).json({ username: user.username, role: user.role, token: username });
}

