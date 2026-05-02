const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDataset(data) {
  // Check for duplicate name
  const existing = await prisma.dataset.findUnique({ where: { name: data.name } });
  if (existing) {
    const err = new Error('Dataset name already exists');
    err.status = 409;
    throw err;
  }
  return await prisma.dataset.create({ data });
}

async function getAllDatasets() {
  return await prisma.dataset.findMany({ orderBy: { createdAt: 'desc' } });
}

async function getDatasetById(id) {
  // Optionally, include pipelines count if relation exists
  return await prisma.dataset.findUnique({ where: { id: Number(id) } });
}

module.exports = {
  createDataset,
  getAllDatasets,
  getDatasetById,
};
