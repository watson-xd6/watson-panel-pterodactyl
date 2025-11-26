import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }

        const normalizedUsername = username.toLowerCase();
        const existingUser = await kv.get(`user:${normalizedUsername}`);

        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username: normalizedUsername,
            email,
            password: hashedPassword,
            role: 'free'
        };

        await kv.set(`user:${normalizedUsername}`, newUser);

        return res.status(201).json({
            message: 'Registration successful!',
            token: 'fake-token-123', // replace with JWT if needed
            username: normalizedUsername,
            role: newUser.role
        });

    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ message: 'Server error during registration.' });
    }
}
