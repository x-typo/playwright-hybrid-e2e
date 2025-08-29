import { APIRequestContext, expect } from "@playwright/test";

type AddCustomerInfo = {
  customerId: string;
  locationId: string;
  displayAs: string;
};

export interface AddedLocationInfo {
  locationId: string;
}

export async function addCustomerAPI(
  apiClient: APIRequestContext,
  overrides: Record<string, any> = {}
): Promise<AddCustomerInfo> {
  const defaultCustomerData = {
    dealerId: "686e94311a8772257f9e9f65",
    firstName: "firstName",
    lastName: "lastName",
    businessName: "",
    displayAs: "addCustomerTest",
    email: `email@email.com`,
    phone: "555-555-5555",
    location: {
      name: "locationName",
      notifyMe: false,
      rescom: "residential",
      addressV2: {
        address1: "123 Test Street",
        address2: "Apt 4B",
        city: "Lehi",
        state: "Utah",
        postalCode: "12345",
        country: "USA",
      },
      timeZoneId: "5a00ac90e21950d76d0e053c",
      ispName: "",
      jobCode: "",
      geometry: {
        lat: 30,
        lng: 30,
      },
    },
  };

  const customerData = { ...defaultCustomerData, ...overrides };
  const response = await apiClient.post("/v3/customers", {
    data: customerData,
  });

  expect(
    response.ok(),
    `Failed to create customer. Status: ${response.status()}`
  ).toBeTruthy();
  const body = await response.json();

  expect(body).toHaveProperty("customerId");
  expect(body).toHaveProperty("locationId");

  return {
    customerId: body.customerId,
    locationId: body.locationId,
    displayAs: customerData.displayAs,
  };
}

export async function editCustomerAPI(
  apiClient: APIRequestContext,
  customerId: string,
  edits: Record<string, any>
): Promise<void> {
  if (!customerId) {
    throw new Error(
      "customerId must be provided to the editCustomerAPI helper."
    );
  }
  const dynamicEdits = {
    displayAs: `editedCustomer${Date.now()}`,
    ...edits,
  };

  const response = await apiClient.put(`/v3/customers`, {
    data: {
      customerId: customerId,
      ...edits,
    },
  });

  expect(
    response.ok(),
    `Failed to edit customer ${customerId}. Status: ${response.status()}`
  ).toBeTruthy();
}

export async function deleteCustomerAPI(
  apiClient: APIRequestContext,
  customerId: string
): Promise<void> {
  if (!customerId) {
    throw new Error("customerId must be provided to deleteCustomer helper.");
  }

  const endpoint = `/v2/customers`;
  const response = await apiClient.delete(endpoint, {
    headers: {
      "x-api-key": "lefqsmukfgrfr2cvxya6cxnlc22i79h97a4bcp76",
    },
    params: {
      customerId: customerId,
      unclaimDevices: true,
      confirmDelete: "DELETE CUSTOMER",
    },
  });

  expect(
    response.ok(),
    `Failed to delete customer ${customerId}. Status: ${response.status()}`
  ).toBeTruthy();
}

export async function toggleCustomerNotificationAPI(
  apiClient: APIRequestContext,
  customerId: string,
  enable: boolean
): Promise<void> {
  const response = await apiClient.put("/v1/customers/notifications", {
    data: {
      customerId: customerId,
      enable: enable,
    },
  });

  expect(
    response.ok(),
    `Failed to set notifications for customer ${customerId}. Status: ${response.status()}`
  ).toBeTruthy();

  const body = await response.json();
  expect(body).toHaveProperty("message");
}

export async function addLocationAPI(
  apiClient: APIRequestContext,
  customerId: string,
  overrides: Record<string, any> = {}
): Promise<AddedLocationInfo> {
  if (!customerId) {
    throw new Error(
      "customerId must be provided to the addLocationAPI helper."
    );
  }

  const defaultLocationData = {
    name: "addLocationTest",
    customerId: customerId,
    notifyMe: true,
    rescom: "residential",
    addressV2: {
      address1: "456 New Location Ave",
      address2: "Suite B",
      city: "Draper",
      state: "Utah",
      postalCode: "84020",
      country: "USA",
    },
    timezoneId: "5a00ac90e21950d76d0e053c",
    ispName: "",
    jobCode: "",
    geometry: {
      lat: 30.5,
      lng: 30.5,
    },
  };

  const locationData = { ...defaultLocationData, ...overrides };

  const response = await apiClient.post("/v3/locations", {
    data: locationData,
  });

  expect(
    response.ok(),
    `Failed to add location. Status: ${response.status()}, Body: ${await response.text()}`
  ).toBeTruthy();

  const body = await response.json();

  expect(body).toHaveProperty("locationId");

  return {
    locationId: body.locationId,
  };
}

export async function deleteLocationAPI(
  apiClient: APIRequestContext,
  locationId: string,
  unclaimDevices: boolean = true
): Promise<void> {
  if (!locationId) {
    throw new Error(
      "locationId must be provided to the deleteLocationAPI helper."
    );
  }

  const endpoint = "/v2/locations";
  const response = await apiClient.delete(endpoint, {
    headers: {
      "x-api-key": "lefqsmukfgrfr2cvxya6cxnlc22i79h97a4bcp76",
    },
    params: {
      locationId: locationId,
      unclaimDevices: unclaimDevices,
      confirmDelete: "DELETE LOCATION",
    },
  });

  expect(
    response.ok(),
    `Failed to delete location ${locationId}. Status: ${response.status()}`
  ).toBeTruthy();
}

export async function toggleLocationNotifications(
  apiClient: APIRequestContext,
  locationId: string,
  enable: boolean
): Promise<void> {
  if (!locationId) {
    throw new Error(
      "locationId must be provided to the toggleLocationNotifications helper."
    );
  }

  const response = await apiClient.put("/v1/locations/notifications", {
    data: {
      locationId: locationId,
      enable: enable,
    },
  });

  expect(
    response.ok(),
    `Failed to set notifications for location ${locationId}. Status: ${response.status()}`
  ).toBeTruthy();

  const body = await response.json();
  expect(body).toHaveProperty("message");
}

export async function setLumaReverseHandoffRequest(
  apiClient: APIRequestContext,
  locationId: string,
  duration: "disabled" | "12h" | "24h" | "48h" | "permanent"
): Promise<void> {
  if (!locationId) {
    throw new Error(
      "locationId must be provided to the setLumaReverseHandoffRequest helper."
    );
  }

  const response = await apiClient.put("/v1/luma/reversehandoff", {
    data: {
      locationId: locationId,
      duration: duration,
    },
  });

  expect(
    response.ok(),
    `Failed to set Luma reverse handoff for location ${locationId}. Status: ${response.status()}`
  ).toBeTruthy();

  const body = await response.json();
  expect(body).toHaveProperty("message");
}
