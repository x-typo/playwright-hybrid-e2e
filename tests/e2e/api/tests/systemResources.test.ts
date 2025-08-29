// import { test, expect } from "../../../_fixtures/automation-fixtures";
// import fs from "fs/promises";

// let accessToken;

// test.beforeEach("Global Setup", async ({ storageState }) => {
//   //@ts-ignore
//   const fileContent = await fs.readFile(storageState, "utf-8");
//   const data = JSON.parse(fileContent);
//   accessToken = data.accessToken;
// });

// test.describe("System Resources Tests", () => {
//   test("Get Read Terms of Services — @Smoke @Regression", async ({
//     request,
//     baseURL,
//   }) => {
//     let response;
//     const endpoint = "/v1/termsofservice";

//     await test.step("Perform GET request for Terms of Service", async () => {
//       response = await request.get(`${baseURL}${endpoint}`, {});
//     });

//     await test.step("Verify response", async () => {
//       const responseBody = await response.json();
//       console.log(JSON.stringify(responseBody, null, 2));
//       expect(response.status()).toBe(200);
//       expect(response.ok()).toBeTruthy();
//       expect(responseBody.items[0]).toHaveProperty("deleted");
//       expect(responseBody.items[0]).toHaveProperty("effectiveDate");
//       expect(responseBody.items[0]).toHaveProperty("termsOfServiceId");
//       expect(responseBody.items[0].html).toContain(
//         "Remote Monitoring Software Licence Agreement and Terms of Use For Authorized Dealers"
//       );
//     });
//   });

//   test("Get Read Internet Service Providers — @Smoke @Regression", async ({
//     request,
//     baseURL,
//   }) => {
//     let response;
//     const endpoint = "/v1/isp?limit=5";
//     const headers = {
//       Authorization: `Bearer ${accessToken}`,
//     };

//     await test.step("Perform GET request to read listed ISPs", async () => {
//       response = await request.get(`${baseURL}${endpoint}`, {
//         headers: headers,
//       });
//     });

//     await test.step("Verify response", async () => {
//       const responseBody = await response.json();
//       console.log(JSON.stringify(responseBody, null, 2));
//       expect(response.status()).toBe(200);
//       expect(response.ok()).toBeTruthy();
//       expect(responseBody.items[0]).toHaveProperty("name");
//     });
//   });
// });
