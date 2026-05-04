const prisma = require('../db/prisma');

const runInclude = {
  pipeline: {
    select: {
      id: true,
      name: true,
      active: true,
      dataset: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  alertEvents: {
    orderBy: { createdAt: 'desc' },
  },
};

async function getAllRuns(filters = {}) {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.pipelineId) {
    where.pipelineId = filters.pipelineId;
  }

  return await prisma.jobRun.findMany({
    where,
    orderBy: { startedAt: 'desc' },
    include: runInclude,
  });
}

async function getRunById(id) {
  return await prisma.jobRun.findUnique({
    where: { id },
    include: runInclude,
  });
}

async function updateRun(id, data) {
  const run = await prisma.jobRun.findUnique({ where: { id } });
  if (!run) {
    const err = new Error('JobRun not found');
    err.status = 404;
    throw err;
  }

  if (run.status !== 'running') {
    const err = new Error(`Invalid state transition: only running JobRuns can be changed to success or failed. Current status is ${run.status}.`);
    err.status = 400;
    throw err;
  }

  const recordsProcessed = data.recordsProcessed ?? run.recordsProcessed ?? 0;

  if (data.status === 'success') {
    return await prisma.jobRun.update({
      where: { id },
      data: {
        status: 'success',
        finishedAt: new Date(),
        recordsProcessed,
        errorMessage: null,
      },
      include: runInclude,
    });
  }

  const errorMessage = data.errorMessage || 'Pipeline run failed';

  return await prisma.$transaction(async (tx) => {
    await tx.jobRun.update({
      where: { id },
      data: {
        status: 'failed',
        finishedAt: new Date(),
        recordsProcessed,
        errorMessage,
      },
    });

    await tx.alertEvent.create({
      data: {
        runId: id,
        ruleId: null,
        message: `Pipeline run failed: ${errorMessage}`,
        severity: 'critical',
        status: 'open',
      },
    });

    return await tx.jobRun.findUnique({
      where: { id },
      include: runInclude,
    });
  });
}

module.exports = {
  getAllRuns,
  getRunById,
  updateRun,
};
