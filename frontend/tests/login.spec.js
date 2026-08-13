import { test, expect } from "@playwright/test";

test("Đăng nhập thành công", async ({ page }) => {

    // Mở trang đăng nhập
    await page.goto("http://localhost:5173/");

    // Nhập email
    await page
        .getByPlaceholder("MSSV hoặc Email trường")
        .fill("nam.cn10032@sv.edu.vn");

    // Nhập mật khẩu
    await page
        .getByPlaceholder("Mật khẩu")
        .fill("10032");

    // Nhấn nút Đăng nhập
    await page
        .getByRole("button", { name: "Đăng nhập" })
        .click();

    // Kiểm tra đã chuyển sang trang chủ
    await expect(page).toHaveURL(/trang-chu/);

});