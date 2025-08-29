// import { test, expect } from "../../../_fixtures/automation-fixtures";
// import fs from "fs/promises";

// let accessToken;
// let poeSwitchId;

// test.beforeEach("Global Setup", async ({ storageState }) => {
//   //@ts-ignore
//   const fileContent = await fs.readFile(storageState, "utf-8");
//   const data = JSON.parse(fileContent);
//   accessToken = data.accessToken;
//   const devices = data.devices;
//   const poeSwitchDevice = devices.find((d) => d.name === "POE Switch");
//   poeSwitchId = poeSwitchDevice ? poeSwitchDevice.id : null;
// });

// test.describe("Network Switch Tests", () => {
//   test("Get Device Status — @Smoke @Regression", async ({ apiClient }) => {
//     let response;
//     const endpoint = "/v1/switch/status";

//     await test.step("Perform GET request to retrieve device status", async () => {
//       response = await apiClient.getDeviceStatus(
//         endpoint,
//         poeSwitchId,
//         accessToken
//       );
//     });

//     await test.step("Verify response", async () => {
//       const responseBody = await response.json();
//       console.log(responseBody);
//       expect(response.status()).toBe(200);
//       expect(response.ok()).toBeTruthy();
//       expect(responseBody).toHaveProperty("deviceId");
//       expect(responseBody).toHaveProperty("dateTime");
//       expect(responseBody).toHaveProperty("uptime");
//       expect(responseBody).toHaveProperty("budgetUtilization");
//       expect(responseBody).toHaveProperty("powerConsumption");
//       expect(responseBody).toHaveProperty("temperature");
//     });
//   });

//   // test("Get Switch PoE Settings — @Smoke @Regression", async ({
//   //   apiClient,
//   // }) => {
//   //   let response;
//   //   const endpoint = "/v1/switch/poesettings";

//   //   await test.step("Perform GET request to retrieve PoE settings", async () => {
//   //     response = await apiClient.getDeviceStatus(
//   //       endpoint,
//   //       poeSwitchId,
//   //       accessToken
//   //     );
//   //   });

//   //   await test.step("Verify response", async () => {
//   //     const responseBody = await response.json();
//   //     console.log(JSON.stringify(responseBody, null, 2));
//   //     expect(response.status()).toBe(200);
//   //     expect(response.ok()).toBeTruthy();
//   //     expect(responseBody).toHaveProperty("deviceId");
//   //     expect(responseBody).toHaveProperty("settings");
//   //     responseBody.settings.forEach((setting) => {
//   //       expect(setting).toHaveProperty("maxPowerAllocation");
//   //       expect(setting).toHaveProperty("name");
//   //       expect(setting).toHaveProperty("number");
//   //       expect(setting).toHaveProperty("poePriority");
//   //       expect(setting).toHaveProperty("powerConsumption");
//   //     });
//   //   });
//   // });
// });

// // test.describe("Doorbell Tests", () => {
// //   test("Get Device Status — @Smoke @Regression", async ({ apiClient }) => {
// //     let response;
// //     const endpoint = "/v1/doorbell/status";

// //     await test.step("Perform GET request to retrieve doorbell status", async () => {
// //       response = await apiClient.getDeviceStatus(
// //         endpoint,
// //         vdbWifiId,
// //         accessToken
// //       );
// //     });

// //     await test.step("Verify response", async () => {
// //       const responseBody = await response.json();
// //       console.log(JSON.stringify(responseBody, null, 2));
// //       expect(response.status()).toBe(200);
// //       expect(response.ok()).toBeTruthy();
// //       expect(responseBody).toHaveProperty("band");
// //       expect(responseBody).toHaveProperty("channel");
// //       expect(responseBody).toHaveProperty("countryCode");
// //       expect(responseBody).toHaveProperty("signalStrength");
// //       expect(responseBody).toHaveProperty("ssid");
// //       expect(responseBody).toHaveProperty("status");
// //     });
// //   });
// // });
