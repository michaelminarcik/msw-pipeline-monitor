const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function minutesAfter(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

async function main() {
  console.log('Clearing existing demo data...');

  await prisma.alertEvent.deleteMany();
  await prisma.alertRule.deleteMany();
  await prisma.jobRun.deleteMany();
  await prisma.pipeline.deleteMany();
  await prisma.dataset.deleteMany();

  console.log('Creating demo datasets...');

  const customerTransactions = await prisma.dataset.create({
    data: {
      name: 'customer_transactions',
      description: 'Raw customer transaction data from e-shop',
      owner: 'analytics-team',
      schemaVersion: 3,
    },
  });

  const customerEvents = await prisma.dataset.create({
    data: {
      name: 'customer_events',
      description: 'User clickstream and product interaction events',
      owner: 'product-analytics',
      schemaVersion: 2,
    },
  });

  const applicationLogs = await prisma.dataset.create({
    data: {
      name: 'application_logs',
      description: 'Application log data used for monitoring and diagnostics',
      owner: 'platform-team',
      schemaVersion: 1,
    },
  });

  console.log('Creating demo pipelines...');

  const dailyAggregation = await prisma.pipeline.create({
    data: {
      datasetId: customerTransactions.id,
      name: 'daily-aggregation',
      description: 'Daily revenue and order aggregation',
      schedule: '0 2 * * *',
      active: true,
    },
  });

  const fraudDetection = await prisma.pipeline.create({
    data: {
      datasetId: customerTransactions.id,
      name: 'fraud-detection',
      description: 'Detect suspicious transaction patterns',
      schedule: '0 */6 * * *',
      active: true,
    },
  });

  const featureEngineering = await prisma.pipeline.create({
    data: {
      datasetId: customerEvents.id,
      name: 'feature-engineering',
      description: 'Prepare behavioral features for recommendation models',
      schedule: '30 1 * * *',
      active: true,
    },
  });

  const logCleanup = await prisma.pipeline.create({
    data: {
      datasetId: applicationLogs.id,
      name: 'log-cleanup',
      description: 'Clean and archive old application logs',
      schedule: '0 4 * * *',
      active: false,
    },
  });

  console.log('Creating demo job runs...');

  const dailySuccessStartedAt = hoursAgo(28);
  await prisma.jobRun.create({
    data: {
      pipelineId: dailyAggregation.id,
      status: 'success',
      startedAt: dailySuccessStartedAt,
      finishedAt: minutesAfter(dailySuccessStartedAt, 8),
      recordsProcessed: 184250,
      errorMessage: null,
    },
  });

  await prisma.jobRun.create({
    data: {
      pipelineId: dailyAggregation.id,
      status: 'running',
      startedAt: hoursAgo(1),
      finishedAt: null,
      recordsProcessed: 46200,
      errorMessage: null,
    },
  });

  const fraudFailedStartedAt = hoursAgo(4);
  const fraudFailedRun = await prisma.jobRun.create({
    data: {
      pipelineId: fraudDetection.id,
      status: 'failed',
      startedAt: fraudFailedStartedAt,
      finishedAt: minutesAfter(fraudFailedStartedAt, 14),
      recordsProcessed: 78200,
      errorMessage: 'Suspicious pattern model timeout',
    },
  });

  const featureSuccessStartedAt = hoursAgo(26);
  await prisma.jobRun.create({
    data: {
      pipelineId: featureEngineering.id,
      status: 'success',
      startedAt: featureSuccessStartedAt,
      finishedAt: minutesAfter(featureSuccessStartedAt, 11),
      recordsProcessed: 93500,
      errorMessage: null,
    },
  });

  const featureFailedStartedAt = hoursAgo(7);
  const featureFailedRun = await prisma.jobRun.create({
    data: {
      pipelineId: featureEngineering.id,
      status: 'failed',
      startedAt: featureFailedStartedAt,
      finishedAt: minutesAfter(featureFailedStartedAt, 9),
      recordsProcessed: 850,
      errorMessage: 'Feature transformation failed',
    },
  });

  const logCleanupStartedAt = hoursAgo(72);
  await prisma.jobRun.create({
    data: {
      pipelineId: logCleanup.id,
      status: 'success',
      startedAt: logCleanupStartedAt,
      finishedAt: minutesAfter(logCleanupStartedAt, 5),
      recordsProcessed: 420000,
      errorMessage: null,
    },
  });

  console.log('Creating demo alert rules...');

  await prisma.alertRule.create({
    data: {
      pipelineId: dailyAggregation.id,
      name: 'runtime alert',
      condition: 'runtime > 10m',
      enabled: true,
    },
  });

  const fraudFailureRule = await prisma.alertRule.create({
    data: {
      pipelineId: fraudDetection.id,
      name: 'failure alert',
      condition: 'status == failed',
      enabled: true,
    },
  });

  const lowRecordsRule = await prisma.alertRule.create({
    data: {
      pipelineId: featureEngineering.id,
      name: 'low records alert',
      condition: 'recordsProcessed < 1000',
      enabled: true,
    },
  });

  console.log('Creating demo alert events...');

  await prisma.alertEvent.create({
    data: {
      runId: fraudFailedRun.id,
      ruleId: fraudFailureRule.id,
      message: 'Pipeline run failed: Suspicious pattern model timeout',
      severity: 'critical',
      status: 'open',
    },
  });

  await prisma.alertEvent.create({
    data: {
      runId: featureFailedRun.id,
      ruleId: lowRecordsRule.id,
      message: 'Pipeline run failed: Feature transformation failed',
      severity: 'critical',
      status: 'open',
    },
  });

  console.log('Demo seed data created successfully.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
