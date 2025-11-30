import Ajv, { ValidateFunction } from 'ajv';
import schema from '../schema/recommendation.schema.json';
import { Recommendation } from './wshp.types';

const ajv = new Ajv({ allErrors: true, strict: true });
const validateFn: ValidateFunction = ajv.compile(schema as object);

export function validateRecommendation(rec: Recommendation): boolean {
  const valid = validateFn(rec as unknown as object);
  if (!valid) {
    // You can inspect validateFn.errors in tests when needed
    return false;
  }
  return true;
}
