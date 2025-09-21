import { BaseApiClient } from "./base.api-client";
import { HEALTH_ENDPOINTS } from "../endpoints/health-endpoints";

export class HealthApiClient extends BaseApiClient {
  async checkHealth() {
    const response = await this.get(HEALTH_ENDPOINTS.CHECK);
    return this.handleResponse<{
      success: boolean;
      status: number;
      message: string;
    }>(response);
  }
}
