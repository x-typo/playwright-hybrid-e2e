import { request, APIRequestContext } from "@playwright/test";
import { HealthApiClient } from "./health.api-client";
import { NotesClient } from "./notes.client";

export class ApiClientFactory {
  private static apiContext: APIRequestContext;

  private static async ensureInit() {
    if (!this.apiContext) {
      if (!process.env.API_BASE_URL) {
        throw new Error("API_BASE_URL is not set — did globalSetup run?");
      }
      if (!process.env.API_TOKEN) {
        throw new Error("API_TOKEN is not set — did globalSetup run?");
      }

      this.apiContext = await request.newContext({
        baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
          "x-auth-token": process.env.API_TOKEN!,
        },
      });
    }
  }

  static async getHealthClient(): Promise<HealthApiClient> {
    await this.ensureInit();
    return new HealthApiClient(this.apiContext);
  }

  static async getNotesClient(): Promise<NotesClient> {
    await this.ensureInit();
    return new NotesClient(this.apiContext);
  }
}
