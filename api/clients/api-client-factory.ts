import { HealthApiClient } from "./health.api-client";

export class ApiClientFactory {
  constructor(private baseURL: string) {}

  getHealthClient(): HealthApiClient {
    return new HealthApiClient(this.baseURL);
  }
}
