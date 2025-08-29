import { expect } from "@playwright/test";
import path from "path";
import fs from "fs/promises";
import Ajv from "ajv";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export async function validateJsonSchema(
  fileName: string,
  filePath: string,
  body: object
) {
  const jsonName = fileName;
  const schemaPath = path.resolve(
    __dirname,
    `../schemas/${filePath}/${jsonName}.json`
  );
  console.log("Resolved schema path:", schemaPath);

  try {
    const schemaContent = await fs.readFile(schemaPath, "utf-8");
    const existingSchema = JSON.parse(schemaContent);

    const ajv = new Ajv({ allErrors: false });
    const validate = ajv.compile(existingSchema);
    const validRes = validate(body);

    if (!validRes) {
      console.log(
        "SCHEMA ERRORS:",
        JSON.stringify(validate.errors),
        "\nRESPONSE BODY:",
        JSON.stringify(body)
      );
    }

    expect(validRes, "Schema validation failed").toBeTruthy();
  } catch (error) {
    console.error("Failed to load schema:", error);
    throw error;
  }
}
