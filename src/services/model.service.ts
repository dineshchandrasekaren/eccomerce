import { Schema, model, Model, Document } from "mongoose";

type IModel<T> = {
  schema: Schema<T>;
  model: Model<T>;
};

function createSchema<T extends Document>(
  schemaDefinition: Record<string, any>,
  modelName: string
): IModel<T> {
  const schema = new Schema<T>(schemaDefinition);
  const modelInstance = model<T>(modelName, schema, modelName);
  return {
    schema,
    model: modelInstance,
  };
}

export default createSchema;
