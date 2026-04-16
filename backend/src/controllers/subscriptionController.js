import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const subscribe = async (req, res) => {
  const { planType } = req.body;
  const userId = req.user.id;
  try {
    const renewalDate = new Date();
    if (planType === 'MONTHLY') renewalDate.setDate(renewalDate.getDate() + 30);
    else renewalDate.setDate(renewalDate.getDate() + 365);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: 'ACTIVE', planType, renewalDate }
    });
    res.json({ message: 'Subscription activated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process subscription' });
  }
};

export const getStatus = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { subscriptionStatus: true, planType: true, renewalDate: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { charity: true } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserAdmin = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (id === req.user.id) {
    if (data.role && data.role !== 'ADMIN') return res.status(400).json({ message: 'Cannot demote self' });
    if (data.subscriptionStatus && data.subscriptionStatus !== 'ACTIVE') return res.status(400).json({ message: 'Cannot deactivate self' });
  }
  try {
    const user = await prisma.user.update({ where: { id }, data });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
};

export const updateUserCharity = async (req, res) => {
  const { charityId, contributionPercent } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { charityId, contributionPercent }
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update charity settings' });
  }
};
