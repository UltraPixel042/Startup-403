# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: persisted-operations.spec.ts >> save café and seat check-in are persisted through the UI
- Location: tests/e2e/persisted-operations.spec.ts:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - navigation "BrewBook navigation" [ref=e3]:
      - link "BrewBook home" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [aria-hidden] [ref=e5]: BB
        - generic [ref=e6]: BrewBook
      - generic [ref=e7]:
        - link "ค้นหาร้าน" [ref=e8] [cursor=pointer]:
          - /url: /discover
        - link "เลือกที่นั่ง" [ref=e9] [cursor=pointer]:
          - /url: /booking
        - link "รายการที่บันทึก" [ref=e10] [cursor=pointer]:
          - /url: /shortlist
        - link "อัปเดตข้อมูลร้าน" [ref=e11] [cursor=pointer]:
          - /url: /partner/field-notes
      - link "เริ่มค้นหา" [ref=e12] [cursor=pointer]:
        - /url: /discover
  - main [ref=e13]:
    - article [ref=e14]:
      - complementary "สถานะข้อมูลต้นแบบ" [ref=e15]:
        - strong [ref=e18]: ข้อมูลตัวอย่าง / Prototype
        - text: — ข้อมูลร้านในหน้านี้ใช้เพื่อทดสอบ flow เท่านั้น และยังไม่ใช่ข้อมูลร้านที่ยืนยันแล้ว · อัปเดตตัวอย่าง 29 ต.ค. 2569
      - generic [ref=e19]:
        - generic [ref=e20]:
          - paragraph [ref=e24]: บางมด · ข้อมูลตัวอย่าง — ใกล้พื้นที่การศึกษา
          - heading "Leaf Lab Café" [level=1] [ref=e25]
          - paragraph [ref=e26]: คาเฟ่ตัวอย่างที่เน้นบรรยากาศเงียบสำหรับอ่านหนังสือและทำงานเดี่ยว
        - generic [ref=e27]:
          - paragraph [ref=e28]:
            - text: "ข้อมูลในโปรไฟล์นี้:"
            - strong [ref=e29]: Sample data / Prototype
          - generic [ref=e30]:
            - button "บันทึกร้าน" [active] [ref=e31] [cursor=pointer]
            - button "แชร์" [ref=e34] [cursor=pointer]
      - region "ข้อมูลเหมาะกับการใช้งาน" [ref=e41]:
        - generic [ref=e42]:
          - paragraph [ref=e43]: เหมาะกับ
          - paragraph [ref=e48]: 1–2 คน
          - paragraph [ref=e49]: รองรับข้อมูลตัวอย่างสูงสุด 18 คน
        - generic [ref=e50]:
          - paragraph [ref=e51]: ปลั๊กไฟ
          - paragraph [ref=e58]: มีปลั๊กบางโต๊ะ
          - paragraph [ref=e59]: ควรตรวจสอบสถานะกับร้านก่อนใช้งานจริง
        - generic [ref=e60]:
          - paragraph [ref=e61]: Wi‑Fi
          - paragraph [ref=e66]: Wi‑Fi เหมาะกับการทำงาน
          - paragraph [ref=e67]: คุณภาพสัญญาณอาจเปลี่ยนตามช่วงเวลา
        - generic [ref=e68]:
          - paragraph [ref=e69]: เวลาเปิด
          - paragraph [ref=e73]: 09:00–20:00
          - paragraph [ref=e74]: เวลาเปิดเป็นข้อมูลตัวอย่าง
      - region "ผังพื้นที่ร้านและการเลือกที่นั่ง" [ref=e75]:
        - region "ผังพื้นที่ของ Leaf Lab Café" [ref=e76]:
          - generic [ref=e77]:
            - generic [ref=e78]:
              - paragraph [ref=e79]: Layout preview
              - heading "ผังพื้นที่ร้าน" [level=2] [ref=e84]
              - paragraph [ref=e85]: Sample layout · ยังไม่ใช่ผังตรวจหน้างาน
            - generic [ref=e86]:
              - generic [ref=e87]: เลือกชั้น
              - combobox "เลือกชั้น" [ref=e88]:
                - option "ชั้น 1" [selected]
                - option "ชั้น 2"
          - tablist "ชั้นของร้าน" [ref=e89]:
            - tab "ชั้น 1" [selected] [ref=e90]
            - tab "ชั้น 2" [ref=e91]
          - region "ชั้น 1 โซนหลักของร้าน — ข้อมูลจำลองจากไฟล์กำหนดผัง" [ref=e92]:
            - 'generic "ทางเข้า: ทางเข้า" [ref=e96]': ทางเข้า
            - 'generic "เคาน์เตอร์: Counter / รับออเดอร์" [ref=e101]': Counter / รับออเดอร์
            - 'generic "ห้องน้ำ: ห้องน้ำ" [ref=e107]': ห้องน้ำ
            - 'generic "บันได: ขึ้นชั้น 2" [ref=e114]': ขึ้นชั้น 2
            - 'generic "ปลั๊กไฟ: ปลั๊กผนัง A" [ref=e118]':
              - generic [ref=e125]: ปลั๊กผนัง A
              - generic [ref=e126]: "4"
            - 'generic "ปลั๊กไฟ: ปลั๊กผนัง B" [ref=e127]':
              - generic [ref=e134]: ปลั๊กผนัง B
              - generic [ref=e135]: "2"
            - 'generic "องค์ประกอบ: หน้าต่าง / แสงธรรมชาติ" [ref=e136]': หน้าต่าง / แสงธรรมชาติ
            - 'generic "โต๊ะ: W1" [ref=e143]': W1
            - 'generic "โต๊ะ: W2" [ref=e145]': W2
            - 'generic "โต๊ะ: W3" [ref=e147]': W3
            - 'generic "โต๊ะ: S1" [ref=e149]': S1
            - 'generic "โต๊ะ: S2" [ref=e151]': S2
          - paragraph [ref=e153]: โซนหลักของร้าน — ข้อมูลจำลองจากไฟล์กำหนดผัง
          - generic "คำอธิบายสัญลักษณ์ในผัง" [ref=e154]:
            - generic [ref=e155]: โต๊ะ
            - generic [ref=e158]: ปลั๊กไฟ
            - generic [ref=e165]: ห้องน้ำ
            - generic [ref=e169]: เคาน์เตอร์
        - generic [ref=e174]:
          - generic [ref=e175]:
            - paragraph [ref=e176]: เลือกที่นั่งจากผัง
            - paragraph [ref=e179]: ผังแยกตามร้านและชั้นจากไฟล์ configuration เดียวกัน เพื่อให้ขยายร้านและแก้ไขพื้นที่ได้โดยไม่ต้องเขียนหน้าใหม่
          - link "เลือกโต๊ะและช่วงเวลา" [ref=e180] [cursor=pointer]:
            - /url: /booking?cafe=leaf-lab-cafe
      - region [ref=e183]:
        - paragraph [ref=e184]: Context fit
        - heading "ร้านนี้เหมาะเมื่อคุณ…" [level=2] [ref=e185]
        - generic [ref=e186]:
          - generic [ref=e187]: อ่านหนังสือ
          - generic [ref=e190]: เงียบ
          - generic [ref=e191]: โต๊ะเดี่ยว
          - generic [ref=e192]: มีปลั๊ก
      - region [ref=e193]:
        - generic [ref=e194]:
          - generic [ref=e195]:
            - paragraph [ref=e196]: Field notes
            - heading "ข้อสังเกตตามบริบท" [level=2] [ref=e197]
          - paragraph [ref=e198]: ทุกข้อเป็นข้อมูลตัวอย่างใน prototype
        - list [ref=e199]:
          - listitem [ref=e200]:
            - paragraph [ref=e201]: "“ข้อมูลตัวอย่าง: จุดริมหน้าต่างเหมาะกับงานที่ต้องใช้สมาธิ และมีปลั๊กใกล้โต๊ะ”"
            - paragraph [ref=e202]: อ่านหนังสือ · แนะนำ 1–2 คน · Sample data / Prototype · 29 ต.ค. 2569
      - region [ref=e206]:
        - paragraph [ref=e207]: Next step
        - heading "ตัดสินใจต่อจากข้อมูลที่มี" [level=2] [ref=e208]
        - paragraph [ref=e209]: BrewBook ช่วยรวมข้อมูลเพื่อเริ่มเลือก ไม่รับประกันที่นั่งหรือสถานะจริง และไม่ได้เป็นระบบจองใน flow นี้
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("save café and seat check-in are persisted through the UI", async ({ page }) => {
  4  |   await page.goto("/cafes/leaf-lab-cafe");
  5  | 
> 6  |   const savedResponse = page.waitForResponse((response) =>
     |                              ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
  7  |     response.url().includes("/api/shortlist") && response.request().method() === "POST",
  8  |   );
  9  |   await page.getByRole("button", { name: "บันทึกร้าน" }).click();
  10 |   expect((await savedResponse).status()).toBe(200);
  11 |   await expect(page.getByRole("button", { name: "อยู่ในรายการของฉัน" })).toBeVisible();
  12 | 
  13 |   const unsavedResponse = page.waitForResponse((response) =>
  14 |     response.url().includes("/api/shortlist") && response.request().method() === "DELETE",
  15 |   );
  16 |   await page.getByRole("button", { name: "อยู่ในรายการของฉัน" }).click();
  17 |   expect((await unsavedResponse).status()).toBe(200);
  18 | 
  19 |   await page.goto("/booking?cafe=leaf-lab-cafe");
  20 |   await page.getByRole("tab", { name: "ชั้น 2" }).click();
  21 |   await page.getByRole("button", { name: "U1" }).click();
  22 | 
  23 |   const checkinResponse = page.waitForResponse((response) =>
  24 |     response.url().includes("/api/seat-checkins") && response.request().method() === "POST",
  25 |   );
  26 |   await page.getByRole("button", { name: /เช็กอินตอนนี้/ }).click();
  27 |   const checkin = await checkinResponse;
  28 |   expect(checkin.status()).toBe(201);
  29 |   await expect(page.getByRole("heading", { name: "โต๊ะที่ฉันกำลังใช้" })).toBeVisible();
  30 |   await expect(page.getByText("U1", { exact: true })).toBeVisible();
  31 | 
  32 |   const checkoutResponse = page.waitForResponse((response) =>
  33 |     response.url().includes("/api/seat-checkins") && response.request().method() === "PATCH",
  34 |   );
  35 |   await page.getByRole("button", { name: "เช็กเอาต์" }).click();
  36 |   expect((await checkoutResponse).status()).toBe(200);
  37 |   await expect(page.getByText("ยังไม่มีการเช็กอินใน session นี้")).toBeVisible();
  38 | });
  39 | 
```