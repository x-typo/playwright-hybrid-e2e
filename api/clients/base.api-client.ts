import { APIRequestContext, APIResponse, request } from "@playwright/test";

export abstract class BaseApiClient {
  protected apiContext!: APIRequestContext;
  protected baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.API_BASE_URL || "";
    if (!this.baseURL) {
      throw new Error(
        "API_BASE_URL is not set. Please configure it in .env or CI/CD variables."
      );
    }
  }

  async init(): Promise<this> {
    if (!this.apiContext) {
      this.apiContext = await request.newContext({
        baseURL: this.baseURL,
      });
    }
    return this;
  }

  protected async get(url: string, options?: any): Promise<APIResponse> {
    await this.ensureContext();
    return this.apiContext.get(url, options);
  }

  protected async post(url: string, options?: any): Promise<APIResponse> {
    await this.ensureContext();
    return this.apiContext.post(url, options);
  }

  protected async put(url: string, options?: any): Promise<APIResponse> {
    await this.ensureContext();
    return this.apiContext.put(url, options);
  }

  protected async delete(url: string, options?: any): Promise<APIResponse> {
    await this.ensureContext();
    return this.apiContext.delete(url, options);
  }

  protected async handleResponse<T = any>(response: APIResponse): Promise<T> {
    if (!response.ok()) {
      throw new Error(`HTTP ${response.status()} - ${await response.text()}`);
    }

    const contentType = response.headers()["content-type"] || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json() : await response.text();

    if (
      isJson &&
      typeof body === "object" &&
      body !== null &&
      "success" in body
    ) {
      if (!body.success || body.status !== 200) {
        throw new Error(body.message || "API request failed");
      }
    }

    return body as T;
  }

  async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }

  private async ensureContext(): Promise<void> {
    if (!this.apiContext) {
      await this.init();
    }
  }
}
