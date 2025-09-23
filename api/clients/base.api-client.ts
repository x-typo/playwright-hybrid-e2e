import { APIRequestContext, APIResponse } from "@playwright/test";

export abstract class BaseApiClient {
  protected apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    if (!apiContext) {
      throw new Error("APIRequestContext is required for BaseApiClient");
    }
    this.apiContext = apiContext;
  }

  protected async get(url: string, options?: any): Promise<APIResponse> {
    return this.apiContext.get(url, options);
  }

  protected async post(url: string, options?: any): Promise<APIResponse> {
    return this.apiContext.post(url, options);
  }

  protected async put(url: string, options?: any): Promise<APIResponse> {
    return this.apiContext.put(url, options);
  }

  protected async patch(url: string, options?: any): Promise<APIResponse> {
    return this.apiContext.fetch(url, { method: "PATCH", ...options });
  }

  protected async delete(url: string, options?: any): Promise<APIResponse> {
    return this.apiContext.delete(url, options);
  }

  protected async handleResponse<T = any>(response: APIResponse): Promise<T> {
    if (!response.ok()) {
      throw new Error(`HTTP ${response.status()} - ${await response.text()}`);
    }

    const contentType = response.headers()["content-type"] || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json() : await response.text();

    if (isJson && typeof body === "object" && body !== null) {
      if ("success" in body && (body as any).success === false) {
        throw new Error((body as any).message || "API request failed");
      }
    }

    return body as T;
  }

  async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }
}
