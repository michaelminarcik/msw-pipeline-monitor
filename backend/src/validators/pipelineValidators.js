const { z } = require('zod');

const pipelineSchema = z.object({
  datasetId: z.string().min(1, 'datasetId is required'),
  name: z.string().min(1, 'name is required'),
  description: z.string().optional(),
  schedule: z.string().optional(),
  active: z.boolean().optional().default(true),
});

function validatePipeline(input) {
  const result = pipelineSchema.safeParse(input);
  if (!result.success) {
    const err = new Error(result.error.errors.map(e => e.message).join(', '));
    err.status = 400;
    throw err;
  }
  return result.data;
}

module.exports = {
  validatePipeline,
};
