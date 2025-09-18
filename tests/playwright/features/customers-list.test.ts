// import { test, expect, asUser } from "../../../fixtures/automation-fixtures";

// test.beforeAll("UNDER CONSTRUCT", async ({}) => {
//   test.skip();
// });

// test.beforeEach("Navigate to page", async ({}) => {
//   await customersListPage.navigateCustomersListPage();
// });

// test.describe("Table View", () => {
//   const listType = "newCustomersPendingList";
//   const accordionButton = "New Customers Pending";
//   const viewModeButton = "Table View Button";

//   test.beforeEach(
//     "Collaspe Pending Customer section and enable table mode",
//     async ({}) => {
//       await customersListPage.selectButton(accordionButton);
//       if (customersListPage.isMob) {
//         await expect(
//           customersListPage.searchBox(listType, "Search")
//         ).toBeHidden();
//         await customersListPage.selectButton(viewModeButton);
//       }
//     }
//   );

//   test("Page Validation", async ({}) => {
//     await test.step("Verify", async () => {
//       await customersListPage.verifyPageTableView();
//     });
//   });

//   test(
//     "Visual Test",
//     {
//       tag: "@visual",
//     },
//     async ({ page }) => {
//       const listType = "customerList";
//       const customerName = "aQA_Test_Customer";
//       const snapshotName = "customersListPageTableView.png";
//       const maxDiffPixelRatio = 0.01;

//       await test.step("Verify before test", async () => {
//         await customersListPage.search(listType, customerName);
//       });
//       await test.step("Perform visual test", async () => {
//         await expect(
//           customersListPage.rowLink(customerName, customerName)
//         ).toBeVisible();
//         await page.evaluate(() => window.scrollTo(0, 0));
//         await page.waitForFunction("window.scrollY === 0");
//         expect(
//           await customersListPage.page.screenshot({
//             animations: "disabled",
//             mask: [
//               navigationDrawer.navBar,
//               navigationDrawer.navBarMobile,
//               topNavigationBar.topNavigationBar,
//               customersListPage.button(accordionButton),
//             ],
//           })
//         ).toMatchSnapshot(snapshotName, {
//           maxDiffPixelRatio: maxDiffPixelRatio,
//         });
//       });
//     }
//   );

//   test.skip(
//     "Accessibility Test",
//     {
//       tag: "@accessibility",
//     },
//     async ({ performAccessibilityScan }) => {
//       const customerName = "aQA_Test_Customer";
//       const rowLink = {
//         name: customerName,
//         link: customerName,
//       };
//       const expectedViolationCount = 0;

//       await test.step("Perform accessibility test", async () => {
//         await expect(
//           customersListPage.rowLink(customerName, customerName)
//         ).toBeVisible();
//         const results = await performAccessibilityScan();
//         await expect.soft(results).toEqual(expectedViolationCount);
//       });
//     }
//   );

//   test("'Add Customer' Button", async ({}) => {
//     const buttonName = "Add Customer";
//     const expectedHeading = "Customer Information";

//     await test.step("Select button", async () => {
//       await customersListPage.selectLink(buttonName);
//     });
//     await test.step("Verify", async () => {
//       await expect(customersListPage.heading(expectedHeading)).toBeVisible();
//     });
//   });

//   test("Search", async ({}) => {
//     const searchData = {
//       searchQuery: "aQA_Test_Customer",
//       results: {
//         expectedName: "aQA_Test_Customer",
//         notExpectedName: "Single_Location_No_Device",
//       },
//     };

//     await test.step("Perform a search", async () => {
//       await customersListPage.search(searchData.searchQuery);
//     });
//     await test.step("Verify", async () => {
//       await customersListPage.verifySearchResultTableView(searchData.results);
//     });
//   });

//   test("Table Tools", async ({}) => {
//     await test.step("Verify", async () => {
//       await customersListPage.verifyTableTools();
//     });
//   });

//   test("Add Customer", async ({ apiClient, deleteCustomerAPI }) => {
//     const linkButtonName = "Add Customer";
//     const locationName = "unverifiedNewLocation";
//     const customerName = "addCustomerTest";
//     const buttonName = "Save";
//     const verificationDetails = {
//       searchQuery: customerName,
//       expectedText: customerName,
//       state: "visible",
//     } as const;
//     let customerId: string;

//     await test.step("Create customer", async () => {
//       await customersListPage.selectLink(linkButtonName);
//       await customerLocationInfoPage.fillOutLocationForm(locationName);
//       await customerLocationInfoPage.fillOutCustomerForm(customerName);
//       await customerLocationInfoPage.selectButton(buttonName);
//     });
//     await test.step("Capture Customer ID from URL", async () => {
//       customerId = await extractCustomerIdFromUrl(dashboardPage.page);
//     });
//     await test.step("Verify after add", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: verificationDetails,
//       });
//     });
//     await test.step("Teardown", async () => {
//       await deleteCustomerAPI(apiClient, customerId);
//     });
//   });

//   test("Edit Customer", async ({
//     apiClient,
//     addCustomerAPI,
//     deleteCustomerAPI,
//   }) => {
//     const initialCustomerName = "editCustomerTest";
//     const menuAction = "Edit Customer";
//     const buttonName = "Save";
//     const editedCustomerData = {
//       firstName: "editedFirstName",
//       lastName: "editedLastName",
//       phone: "+1 444-555-6666",
//       email: "emailEdited@email.com",
//       displayAs: "editedCustomerTest",
//     };
//     const initialVerification = {
//       searchQuery: initialCustomerName,
//       expectedText: initialCustomerName,
//       state: "visible",
//     } as const;
//     const editedVerification = {
//       searchQuery: editedCustomerData.displayAs,
//       expectedText: editedCustomerData.displayAs,
//       state: "visible",
//     } as const;
//     let customerInfo: {
//       customerId: string;
//       displayAs: string;
//     };

//     await test.step("Setup", async () => {
//       customerInfo = await addCustomerAPI(apiClient, {
//         displayAs: initialCustomerName,
//       });
//     });
//     await test.step("Verify before edit", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: initialVerification,
//       });
//     });
//     await test.step("Edit customer", async () => {
//       await customersListPage.search(initialCustomerName);
//       await customersListPage.selectRowAction(menuAction);
//       await settingsPage.editCustomerInfo(editedCustomerData);
//       await settingsPage.selectButton(buttonName);
//     });
//     await test.step("Verify after edit", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: editedVerification,
//       });
//     });
//     await test.step("Teardown", async () => {
//       await deleteCustomerAPI(apiClient, customerInfo.customerId);
//     });
//   });

//   test("Delete Customer", async ({ modalsPage, apiClient, addCustomerAPI }) => {
//     const customerName = "deleteCustomerTest";
//     const menuAction = "deleteOption";
//     const rowLink = {
//       name: customerName,
//       link: customerName,
//     };
//     const modalData = {
//       confirmationText: "DELETE CUSTOMER",
//       modalType: "customer",
//     };
//     const initialVerification = {
//       searchQuery: customerName,
//       expectedText: customerName,
//       state: "visible",
//     } as const;
//     const finalVerification = {
//       searchQuery: customerName,
//       expectedText: customerName,
//       state: "hidden",
//     } as const;

//     await test.step("Setup", async () => {
//       await addCustomerAPI(apiClient, {
//         displayAs: customerName,
//       });
//     });
//     await test.step("Verify before delete", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: initialVerification,
//       });
//     });
//     await test.step("Delete customer", async () => {
//       await customersListPage.search(customerName);
//       await customersListPage.selectRowLink(rowLink);
//       await dashboardPage.selectAction(menuAction);
//       await modalsPage.deleteLocationCustomer(modalData);
//     });
//     await test.step("Verify after delete", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: finalVerification,
//       });
//     });
//   });

//   test("Add Location", async ({
//     apiClient,
//     addCustomerAPI,
//     deleteCustomerAPI,
//   }) => {
//     const customerName = "addLocationTest";
//     const initialLocationName = "locationName";
//     const additionalLocationName = "addNewLocation";
//     const menuAction = "Add Location";
//     const buttonName = "Save";
//     const expectedText = "2 Locations";
//     const initialVerification = {
//       searchQuery: customerName,
//       expectedText: initialLocationName,
//       state: "visible",
//     } as const;
//     const finalVerification = {
//       searchQuery: customerName,
//       expectedText: expectedText,
//       state: "visible",
//     } as const;

//     let customerInfo: {
//       customerId: string;
//       displayAs: string;
//     };

//     await test.step("Setup", async () => {
//       customerInfo = await addCustomerAPI(apiClient, {
//         displayAs: customerName,
//       });
//     });
//     await test.step("Verify before add", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: initialVerification,
//       });
//     });
//     await test.step("Add new location to existing customer", async () => {
//       await customersListPage.selectRowAction(menuAction);
//       await customerLocationInfoPage.fillOutLocationForm(
//         additionalLocationName
//       );
//       await customerLocationInfoPage.selectButton(buttonName);
//     });
//     await test.step("Verify after add", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: finalVerification,
//       });
//     });
//     await test.step("Teardown", async () => {
//       await deleteCustomerAPI(apiClient, customerInfo.customerId);
//     });
//   });

//   test("Edit Location", async ({
//     apiClient,
//     addCustomerAPI,
//     deleteCustomerAPI,
//   }) => {
//     const customerName = "editLocationTest";
//     const initialLocationName = "locationName";
//     const menuAction = "Edit Location";
//     const buttonName = "Save";
//     const editedLocationData = {
//       locationName: "editedLocationName",
//       jobCode: "jobCode123",
//     };
//     const initialVerification = {
//       searchQuery: customerName,
//       expectedText: initialLocationName,
//       state: "visible",
//     } as const;
//     const editedVerification = {
//       searchQuery: customerName,
//       expectedText: editedLocationData.locationName,
//       state: "visible",
//     } as const;
//     let customerInfo: {
//       customerId: string;
//       displayAs: string;
//     };

//     await test.step("Setup", async () => {
//       customerInfo = await addCustomerAPI(apiClient, {
//         displayAs: customerName,
//         locationName: initialLocationName,
//       });
//     });
//     await test.step("Verify before edit", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: initialVerification,
//       });
//     });
//     await test.step("Edit location", async () => {
//       await customersListPage.search(customerName);
//       await customersListPage.selectRowAction(menuAction);
//       await settingsPage.editLocationInfo(editedLocationData);
//       await settingsPage.selectButton(buttonName);
//     });
//     await test.step("Verify after edit", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: editedVerification,
//       });
//     });
//     await test.step("Teardown", async () => {
//       await deleteCustomerAPI(apiClient, customerInfo.customerId);
//     });
//   });

//   test("Delete Location", async ({
//     modalsPage,
//     apiClient,
//     addCustomerAPI,
//     deleteCustomerAPI,
//     addLocationAPI,
//   }) => {
//     const customerName = "deleteLocationCustomer";
//     const initialLocationText = "2 Locations";
//     const finalLocationText = "addLocationTest";
//     const locationToDelete = "locationName";
//     const menuAction = "Delete Location";
//     const buttonName = "Table View Button";
//     const rowLink = {
//       name: customerName,
//       link: customerName,
//     };
//     const modalData = {
//       confirmationText: "DELETE LOCATION",
//       modalType: "location",
//     };
//     const initialVerification = {
//       searchQuery: customerName,
//       expectedText: initialLocationText,
//       state: "visible",
//     } as const;
//     const finalVerification = {
//       searchQuery: customerName,
//       expectedText: finalLocationText,
//       state: "visible",
//     } as const;
//     let customerId: string;

//     await test.step("Setup", async () => {
//       const customer = await addCustomerAPI(apiClient, {
//         displayAs: customerName,
//       });
//       customerId = customer.customerId;
//       await addLocationAPI(apiClient, customerId);
//     });
//     await test.step("Verify before delete", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: initialVerification,
//       });
//     });
//     await test.step("Delete location from customer", async () => {
//       await customersListPage.selectRowLink(rowLink);
//       if (customersListPage.isMob) {
//         await customersListPage.selectButton(buttonName);
//       }
//       await modalsPage.deleteLocationCustomer(modalData);
//     });
//     await test.step("Verify after delete", async () => {
//       await customersListPage.verifyElementStateAfterUpdate({
//         verification: finalVerification,
//       });
//     });
//     await test.step("Teardown", async () => {
//       await deleteCustomerAPI(apiClient, customerId);
//     });
//   });

//   test("Enable Notifications", async ({
//     modalsPage,
//     apiClient,
//     toggleCustomerNotificationAPI,
//   }) => {
//     const searchQuery = "Single_Location_No_Device";
//     const menuAction = "Monitor";
//     const expectedText = "Notifications are now enabled";
//     const iconName = "NotificationsOutlinedIcon";
//     const customerId = "686e96d71a8772257f9e9f84";
//     const setNotifications = false;

//     await test.step("Enable notifications", async () => {
//       await customersListPage.search(searchQuery);
//       await customersListPage.selectRowAction(menuAction);
//     });
//     await test.step("Verify", async () => {
//       await expect(customersListPage.text(expectedText)).toBeVisible();
//       await expect(customersListPage.icon(iconName)).toBeVisible();
//     });
//     await test.step("Teardown", async () => {
//       await toggleCustomerNotificationAPI(
//         apiClient,
//         customerId,
//         setNotifications
//       );
//     });
//   });

//   test("Disable Notifications", async ({
//     modalsPage,
//     apiClient,
//     toggleCustomerNotificationAPI,
//   }) => {
//     const searchQuery = "Single_Location_Have_Device";
//     const menuAction = "Monitor";
//     const confirmButtonText = "Confirm";
//     const expectedText = "Notifications are now disabled";
//     const iconName = "NotificationsOutlinedIcon";
//     const customerId = "686e96c31a8772257f9e9f81";
//     const setNotifications = true;

//     await test.step("Disable notifications", async () => {
//       await customersListPage.search(searchQuery);
//       await customersListPage.selectRowAction(menuAction);
//       await modalsPage.selectButton(confirmButtonText);
//     });
//     await test.step("Verify", async () => {
//       await expect(customersListPage.text(expectedText)).toBeVisible();
//       await expect(customersListPage.icon(iconName)).toBeHidden();
//     });
//     await test.step("Teardown", async () => {
//       await toggleCustomerNotificationAPI(
//         apiClient,
//         customerId,
//         setNotifications
//       );
//     });
//   });
// });
