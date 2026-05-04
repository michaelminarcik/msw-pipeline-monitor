const prisma = require('../db/prisma');

const alertRuleInclude = {
  pipeline: {
    select: {
      id: true,
      name: true,
      active: true,
    },
  },
};

const alertRuleDetailInclude = {
  ...alertRuleInclude,
  alertEvents: {
    orderBy: { createdAt: 'desc' },
  },
};

async function createAlertRule(data) {
  const pipeline = await prisma.pipeline.findUnique({
    where: { id: data.pipelineId },
  });

  if (!pipeline) {
    const err = new Error('Pipeline does not exist');
    err.status = 404;
    throw err;
  }

  return await prisma.alertRule.create({
    data,
    include: alertRuleInclude,
  });
}

async function getAllAlertRules(filters = {}) {
  const where = {};

  if (filters.pipelineId) {
    where.pipelineId = filters.pipelineId;
  }

  return await prisma.alertRule.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: alertRuleInclude,
  });
}

async function getAlertRuleById(id) {
  return await prisma.alertRule.findUnique({
    where: { id },
    include: alertRuleDetailInclude,
  });
}

async function updateAlertRule(id, data) {
  const alertRule = await prisma.alertRule.findUnique({ where: { id } });

  if (!alertRule) {
    const err = new Error('AlertRule not found');
    err.status = 404;
    throw err;
  }

  return await prisma.alertRule.update({
    where: { id },
    data,
    include: alertRuleDetailInclude,
  });
}

async function deleteAlertRule(id) {
  const alertRule = await prisma.alertRule.findUnique({
    where: { id },
    include: {
      _count: {
        select: { alertEvents: true },
      },
    },
  });

  if (!alertRule) {
    const err = new Error('AlertRule not found');
    err.status = 404;
    throw err;
  }

  if (alertRule._count.alertEvents > 0) {
    const err = new Error('AlertRule cannot be deleted because it has related AlertEvents');
    err.status = 400;
    throw err;
  }

  await prisma.alertRule.delete({ where: { id } });
}

module.exports = {
  createAlertRule,
  getAllAlertRules,
  getAlertRuleById,
  updateAlertRule,
  deleteAlertRule,
};
