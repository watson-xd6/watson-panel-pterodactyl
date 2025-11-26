import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const normalizedUsername = username.toLowerCase();
        const user = await kv.get(`user:${normalizedUsername}`);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        return res.status(200).json({
            message: 'Login successful!',
            token: 'fake-token-123', // replace with JWT if needed
            username: user.username,
            role: user.role
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server error during login.' });
    }
}
