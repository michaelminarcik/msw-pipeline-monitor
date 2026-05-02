const { z } = require('zod');

const datasetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  owner: z.string().min(1, 'Owner is required'),
  description: z.string().optional(),
  schemaVersion: z.number().int().positive().optional().default(1),
});

function validateDataset(input) {
  const result = datasetSchema.safeParse(input);
  if (!result.success) {
    const err = new Error(result.error.errors.map(e => e.message).join(', '));
    err.status = 400;
    throw err;
  }
  return result.data;
}

module.exports = {
  validateDataset,
};
