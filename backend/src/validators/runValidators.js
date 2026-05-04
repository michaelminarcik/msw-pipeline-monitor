const { z } = require('zod');

const runQuerySchema = z.object({
  status: z.enum(['pending', 'running', 'success', 'failed']).optional(),
  pipelineId: z.string().min(1, 'pipelineId cannot be empty').optional(),
});

const updateRunSchema = z.object({
  status: z.enum(['success', 'failed'], {
    required_error: 'status is required',
    invalid_type_error: 'status must be either success or failed',
  }),
  recordsProcessed: z.number().int().nonnegative().optional(),
  errorMessage: z.string().optional(),
});

function formatZodError(error) {
  return error.errors.map(e => e.message).join(', ');
}

function validateRunQuery(input) {
  const result = runQuerySchema.safeParse(input);
  if (!result.success) {
    const err = new Error(formatZodError(result.error));
    err.status = 400;
    throw err;
  }
  return result.data;
}

function validateRunUpdate(input) {
  const result = updateRunSchema.safeParse(input);
  if (!result.success) {
    const err = new Error(formatZodError(result.error));
    err.status = 400;
    throw err;
  }
  return result.data;
}

module.exports = {
  validateRunQuery,
  validateRunUpdate,
};
