import Ajv from 'ajv';
import schema from '../schema/recommendation.schema.json';
const ajv = new Ajv({ allErrors: true, strict: true });
const validateFn = ajv.compile(schema);
export function validateRecommendation(rec) {
    const valid = validateFn(rec);
    if (!valid) {
        // You can inspect validateFn.errors in tests when needed
        return false;
    }
    return true;
}
