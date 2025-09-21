import { test, expect } from "../../../fixtures/automation-fixtures";

test.describe("Health Check API", () => {
  test(
    "Verify API health endpoint",
    { tag: ["@smoke"] },
    async ({ healthClient }) => {
      const result = await healthClient.checkHealth();

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.message.toLowerCase()).toContain("api is running");
    }
  );
});
