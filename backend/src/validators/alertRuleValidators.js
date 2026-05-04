const { z } = require('zod');

const createAlertRuleSchema = z.object({
  pipelineId: z.string().min(1, 'pipelineId is required'),
  name: z.string().min(1, 'name is required'),
  condition: z.string().min(1, 'condition is required'),
  enabled: z.boolean().optional().default(true),
});

const updateAlertRuleSchema = z.object({
  name: z.string().min(1, 'name cannot be empty').optional(),
  condition: z.string().min(1, 'condition cannot be empty').optional(),
  enabled: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

const alertRuleQuerySchema = z.object({
  pipelineId: z.string().min(1, 'pipelineId cannot be empty').optional(),
});

function formatZodError(error) {
  return error.errors.map(e => e.message).join(', ');
}

function validateAlertRule(input) {
  const result = createAlertRuleSchema.safeParse(input);
  if (!result.success) {
    const err = new Error(formatZodError(result.error));
    err.status = 400;
    throw err;
  }
  return result.data;
}

function validateAlertRuleUpdate(input) {
  const result = updateAlertRuleSchema.safeParse(input);
  if (!result.success) {
    const err = new Error(formatZodError(result.error));
    err.status = 400;
    throw err;
  }
  return result.data;
}

function validateAlertRuleQuery(input) {
  const result = alertRuleQuerySchema.safeParse(input);
  if (!result.success) {
    const err = new Error(formatZodError(result.error));
    err.status = 400;
    throw err;
  }
  return result.data;
}

module.exports = {
  validateAlertRule,
  validateAlertRuleUpdate,
  validateAlertRuleQuery,
};
