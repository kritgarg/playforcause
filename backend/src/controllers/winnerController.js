import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMyWinnings = async (req, res) => {
  try {
    const winnings = await prisma.winner.findMany({
      where: { userId: req.user.id },
      include: { draw: true }
    });
    res.json(winnings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch winnings' });
  }
};

export const getAllWinnersAdmin = async (req, res) => {
  try {
    const winners = await prisma.winner.findMany({ include: { user: true, draw: true } });
    res.json(winners);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all winners' });
  }
};

export const updateWinnerStatusAdmin = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const winner = await prisma.winner.update({ where: { id }, data: { status } });
    res.json(winner);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
};
