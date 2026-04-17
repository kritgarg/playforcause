import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const runDrawAdmin = async (req, res) => {
  try {
    const winningNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1);
    const subscribers = await prisma.user.findMany({
      where: { subscriptionStatus: 'ACTIVE' },
      include: { scores: true }
    });

    const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const draw = await prisma.draw.create({
      data: { month, winningNumbers: JSON.stringify(winningNumbers), winnersCount: 0 }
    });

    let winnersCount = 0;
    for (const u of subscribers) {
      const matchCount = u.scores.filter(s => winningNumbers.includes(s.score)).length;
      if (matchCount >= 3) {
        await prisma.winner.create({
          data: { userId: u.id, drawId: draw.id, matchCount, status: 'PENDING' }
        });
        winnersCount++;
      }
    }

    await prisma.draw.update({ where: { id: draw.id }, data: { winnersCount } });
    res.json({ message: 'Draw completed', draw, winnersCount });
  } catch (err) {
    res.status(500).json({ message: 'Draw failed' });
  }
};
