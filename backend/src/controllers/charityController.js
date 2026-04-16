import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCharities = async (req, res) => {
  try {
    const charities = await prisma.charity.findMany();
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch charities' });
  }
};

export const createCharityAdmin = async (req, res) => {
  try {
    const charity = await prisma.charity.create({ data: req.body });
    res.status(201).json(charity);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create charity' });
  }
};

export const updateCharityAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const charity = await prisma.charity.update({ where: { id }, data: req.body });
    res.json(charity);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
};

export const deleteCharityAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.charity.delete({ where: { id } });
    res.json({ message: 'Charity deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed' });
  }
};
