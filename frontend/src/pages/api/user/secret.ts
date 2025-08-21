import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession();

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.status(200).json({ encryptedSecretKey: session.user.encryptedSecretKey });
}