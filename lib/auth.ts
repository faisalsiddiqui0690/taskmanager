import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-env';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(user: any) {
  const userId = typeof user.get === 'function' ? user.get('id') : user.id;
  const role = typeof user.get === 'function' ? user.get('role') : user.role;
  return jwt.sign({ userId: userId.toString(), role: role || 'user' }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch (err) {
    return null;
  }
}
