import { expect, test } from "@playwright/test";

test("save café and seat check-in are persisted through the UI", async ({ page }) => {
  await page.goto("/cafes/leaf-lab-cafe");

  const savedResponse = page.waitForResponse((response) =>
    response.url().includes("/api/shortlist") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "บันทึกร้าน" }).click();
  expect((await savedResponse).status()).toBe(200);
  await expect(page.getByRole("button", { name: "อยู่ในรายการของฉัน" })).toBeVisible();

  const unsavedResponse = page.waitForResponse((response) =>
    response.url().includes("/api/shortlist") && response.request().method() === "DELETE",
  );
  await page.getByRole("button", { name: "อยู่ในรายการของฉัน" }).click();
  expect((await unsavedResponse).status()).toBe(200);

  await page.goto("/booking?cafe=leaf-lab-cafe");
  await page.getByRole("tab", { name: "ชั้น 2" }).click();
  await page.getByRole("button", { name: "U1" }).click();

  const checkinResponse = page.waitForResponse((response) =>
    response.url().includes("/api/seat-checkins") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: /เช็กอินตอนนี้/ }).click();
  const checkin = await checkinResponse;
  expect(checkin.status()).toBe(201);
  await expect(page.getByRole("heading", { name: "โต๊ะที่ฉันกำลังใช้" })).toBeVisible();
  await expect(page.getByText("U1", { exact: true })).toBeVisible();

  const checkoutResponse = page.waitForResponse((response) =>
    response.url().includes("/api/seat-checkins") && response.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "เช็กเอาต์" }).click();
  expect((await checkoutResponse).status()).toBe(200);
  await expect(page.getByText("ยังไม่มีการเช็กอินใน session นี้")).toBeVisible();
});
