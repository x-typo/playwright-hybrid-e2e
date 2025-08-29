import { test, expect } from "../../../_fixtures/automation-fixtures";
import { createCustomer } from "./helpers/createCustomer";
import { deleteCustomer } from "./helpers/deleteCustomer";

let accessToken;

test.beforeEach(async ({ readFile, storageState }) => {
  //@ts-ignore
  const fileContent = await readFile(storageState, "utf-8");
  const data = JSON.parse(fileContent);
  accessToken = data.accessToken;
});

test.describe("Customers API", () => {
  test("Create + Delete Customer", async ({ apiClient }) => {
    const customer = await createCustomer(apiClient, {
      displayAs: "createDeleteCustomer",
    });
    expect(customer.customerId).toBeDefined();

    await deleteCustomer(apiClient, customer.customerId);
  });
});
