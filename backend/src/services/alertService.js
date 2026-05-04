const prisma = require('../db/prisma');

const alertInclude = {
  run: {
    select: {
      id: true,
      status: true,
      startedAt: true,
      finishedAt: true,
      pipeline: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  rule: {
    select: {
      id: true,
      name: true,
      condition: true,
      enabled: true,
    },
  },
};

async function getAllAlerts(filters = {}) {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.severity) {
    where.severity = filters.severity;
  }

  if (filters.runId) {
    where.runId = filters.runId;
  }

  return await prisma.alertEvent.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: alertInclude,
  });
}

async function getAlertById(id) {
  return await prisma.alertEvent.findUnique({
    where: { id },
    include: alertInclude,
  });
}

module.exports = {
  getAllAlerts,
  getAlertById,
};
