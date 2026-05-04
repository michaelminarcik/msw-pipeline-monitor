const { z } = require('zod');

const alertQuerySchema = z.object({
  status: z.enum(['open', 'resolved']).optional(),
  severity: z.enum(['info', 'warning', 'critical']).optional(),
  runId: z.string().min(1, 'runId cannot be empty').optional(),
});

function validateAlertQuery(input) {
  const result = alertQuerySchema.safeParse(input);
  if (!result.success) {
    const err = new Error(result.error.errors.map(e => e.message).join(', '));
    err.status = 400;
    throw err;
  }
  return result.data;
}

module.exports = {
  validateAlertQuery,
};
