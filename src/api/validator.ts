// import Validator from 'swagger-model-validator';
const Validator = require('swagger-model-validator');
import spec from '../swagger/spec';
import { ErrorResponse } from '../models/error';

const validator = new Validator(spec);

export function validateModel(modelName: string, object: Record<string, unknown>) {
  const validation = validator.swagger.validateModel(modelName, object);

  if (!validation.valid) {
    throw new ErrorResponse(400, validation.GetErrorMessages().join('\n'));
  }
}
