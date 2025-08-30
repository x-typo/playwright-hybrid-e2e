import { test as setup } from "@playwright/test";
import fs from "fs/promises";

const apiDevFile = "playwright/auth/apiDev.json";

setup("API Dev Account", async ({ request }) => {
  const endpoint = "https://api.dev.com/v1/users/login";
  const response = await request.post(endpoint, {
    data: {
      username: "email@email.com",
      password: "password",
    },
  });

  const content = await response.json();

  if (!response.ok()) {
    console.error("Failed to log in via API:", content);
    throw new Error("API login failed");
  }

  await fs.writeFile(
    apiDevFile,
    JSON.stringify({
      accessToken: content.accessToken,
    })
  );

  console.log("API login successful. Access token saved.");
});
