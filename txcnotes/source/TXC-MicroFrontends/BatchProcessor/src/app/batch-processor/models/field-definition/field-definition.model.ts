import { InputModel } from '../dumb-models/input.model';

export interface FieldsDefinition {
    define(): InputModel[];
}