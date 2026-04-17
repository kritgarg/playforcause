import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addScore = async (req, res) => {
  const { score, date } = req.body;
  
  if (score < 1 || score > 45) {
    return res.status(400).json({ message: 'Score must be between 1 and 45' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { scores: true } });
    if (user.subscriptionStatus !== 'ACTIVE') return res.status(403).json({ message: 'Active subscription required' });

    // Check for duplicate date
    const parsedDate = new Date(date).toISOString().split('T')[0];
    const existingDate = user.scores.find(s => new Date(s.date).toISOString().split('T')[0] === parsedDate);
    if (existingDate) return res.status(400).json({ message: 'A score for this date already exists.' });

    if (user.scores.length >= 5) {
       const oldest = user.scores.sort((a,b) => new Date(a.date) - new Date(b.date))[0];
       await prisma.score.delete({ where: { id: oldest.id } });
    }

    const newScore = await prisma.score.create({
      data: { score, date: new Date(date), userId: req.user.id }
    });
    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ message: 'Failed to log score' });
  }
};

export const getScores = async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch scores' });
  }
};
