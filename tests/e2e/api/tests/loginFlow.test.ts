// import { test, expect } from "../../../_fixtures/automation-fixtures";

// test.describe("Login Flow Tests", () => {
//   test("Post Forgot Password — @Smoke @Regression", async ({
//     request,
//     baseURL,
//   }) => {
//     let response;
//     const endpoint = "/v1/users/forgotpassword";
//     const username = "email@email.com";

//     await test.step("Perform POST request for Forgot Password", async () => {
//       response = await request.post(`${baseURL}${endpoint}`, {
//         data: {
//           username: username,
//         },
//       });
//     });
//     await test.step("Verify response", async () => {
//       const responseBody = await response.json();
//       console.log(JSON.stringify(responseBody, null, 2));
//       expect(response.status()).toBe(200);
//       expect(response.ok()).toBeTruthy();
//       expect(responseBody.message.description).toContain(
//         "If this email address is associated"
//       );
//     });
//   });
// });
