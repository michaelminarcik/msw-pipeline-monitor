const prisma = require('../db/prisma');

async function createPipeline(data) {
  // Check that dataset exists
  const dataset = await prisma.dataset.findUnique({ where: { id: data.datasetId } });
  if (!dataset) {
    const err = new Error('Dataset does not exist');
    err.status = 404;
    throw err;
  }
  // Check for duplicate pipeline name within the same dataset
  const existing = await prisma.pipeline.findUnique({
    where: {
      datasetId_name: {
        datasetId: data.datasetId,
        name: data.name,
      },
    },
  });
  if (existing) {
    const err = new Error('Pipeline name already exists for this dataset');
    err.status = 409;
    throw err;
  }
  return await prisma.pipeline.create({ data });
}

async function getAllPipelines() {
  return await prisma.pipeline.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      dataset: { select: { id: true, name: true, owner: true } },
      runs: {
        orderBy: { startedAt: 'desc' },
        take: 1,
        select: { id: true, status: true, startedAt: true, finishedAt: true },
      },
    },
  });
}

async function getPipelineById(id) {
  return await prisma.pipeline.findUnique({
    where: { id },
    include: {
      dataset: { select: { id: true, name: true, owner: true } },
      runs: {
        orderBy: { startedAt: 'desc' },
        take: 5,
        select: { id: true, status: true, startedAt: true, finishedAt: true },
      },
      alertRules: true,
    },
  });
}

async function runPipeline(id) {
  const pipeline = await prisma.pipeline.findUnique({ where: { id } });
  if (!pipeline) {
    const err = new Error('Pipeline not found');
    err.status = 404;
    throw err;
  }

  if (!pipeline.active) {
    const err = new Error('Pipeline is inactive and cannot be run');
    err.status = 400;
    throw err;
  }

  return await prisma.jobRun.create({
    data: {
      pipelineId: id,
      status: 'running',
      startedAt: new Date(),
      recordsProcessed: 0,
      finishedAt: null,
      errorMessage: null,
    },
  });
}

module.exports = {
  createPipeline,
  getAllPipelines,
  getPipelineById,
  runPipeline,
};
