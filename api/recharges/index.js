import connectToDatabase from '../../_utils/db.js';
import { Recharge } from '../../_utils/models.js';
import { verifyToken } from '../../_utils/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const recharges = await Recharge.find({ userId }).sort({ date: -1 });
      return res.status(200).json(recharges);
    } 
    
    if (req.method === 'POST') {
      const newRecharge = await Recharge.create({ ...req.body, userId });
      return res.status(201).json(newRecharge);
    }
    
    if (req.method === 'DELETE') {
      await Recharge.deleteMany({ userId });
      return res.status(200).json({ message: 'History cleared' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
