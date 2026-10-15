import { prisma } from '../config/database.js';

const publicUserSelect = {
  id: true,
  username: true,
  role: true,
  guruId: true,
  createdAt: true,
  updatedAt: true,
};

const findUserByUsername = (username) =>
  prisma.user.findFirst({
    where: { username, deletedAt: null },
    select: { ...publicUserSelect, password: true },
  });

const findUserById = (id) =>
  prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: publicUserSelect,
  });

const createUser = ({ username, password, role, guruId }) =>
  prisma.user.create({
    data: {
      username,
      password,
      ...(role !== undefined && { role }),
      ...(guruId !== undefined && { guruId }),
    },
    select: publicUserSelect,
  });

const updateUser = (id, { username, password, role, guruId }) =>
  prisma.user.update({
    where: { id, deletedAt: null },
    data: {
      ...(username !== undefined && { username }),
      ...(password !== undefined && { password }),
      ...(role !== undefined && { role }),
      ...(guruId !== undefined && { guruId }),
    },
    select: publicUserSelect,
  });

const softDeleteUser = (id) =>
  prisma.user.update({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
    select: publicUserSelect,
  });

export {
  findUserByUsername,
  findUserById,
  createUser,
  updateUser,
  softDeleteUser,
};
