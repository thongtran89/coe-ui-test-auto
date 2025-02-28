const { test, expect } = require("@playwright/test");
const { Inventory } = require("../pages/inventory-page");
const { Login } = require("../pages/login-page");

test.describe("Swag Labs Inventory page", () => {
  test("Check element in Inventory page", async ({ page }) => {
    const inventory = new Inventory(page);

    const username = "standard_user";
    const password = "secret_sauce";
    await inventory.navigateToInventoryPage(username, password);

    //Header
    expect(inventory.logo).toBe("Swag Labs");
    expect(inventory.menuBar).toBeTruthy();
    expect(inventory.shoppingCart).toBeTruthy();
    //Footer bar
    expect(inventory.twitter).toBeTruthy();
    expect(inventory.facebook).toBeTruthy();
    expect(inventory.linkedin).toBeTruthy();
    expect(inventory.copyright).toHaveText(
      "© 2024 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy"
    );

    //Inventory Item
    await inventory.checkInventoryItemElement();

    //Menu side bar
    await inventory.checkMenuSideBarElement();

    //Sort
    await inventory.checkSortElement();
  });

  test('Click "Add to Cart", change button to "Remove" and update cart count', async ({
    page,
  }) => {
    const inventory = await new Inventory(page);

    const username = "standard_user";
    const password = "secret_sauce";
    await inventory.navigateToInventoryPage(username, password);

    await inventory.addToCart("sauce-labs-fleece-jacket");
  });

  test('Click "Add to Cart" two item, and Click remove one item', async ({
    page,
  }) => {
    const inventory = await new Inventory(page);

    const username = "standard_user";
    const password = "secret_sauce";
    await inventory.navigateToInventoryPage(username, password);

    await inventory.addToCart("sauce-labs-fleece-jacket");
    await inventory.addToCart("sauce-labs-onesie");

    await inventory.removeItem("sauce-labs-onesie");
  });

  test("should sort products by name (A-Z)", async ({ page }) => {
    const inventory = await new Inventory(page);

    const username = "standard_user";
    const password = "secret_sauce";
    await inventory.navigateToInventoryPage(username, password);

    await inventory.sort.click();
    await inventory.sort.selectOption("az"); // Select "Name (Z to A)"

    const productNames = await page
      .locator(".inventory_item_name")
      .allTextContents();

    expect(productNames).toEqual(productNames.slice().sort()); // Check ascending order
  });

  test("should sort products by name (Z-A)", async ({ page }) => {
    const inventory = await new Inventory(page);

    const username = "standard_user";
    const password = "secret_sauce";
    await inventory.navigateToInventoryPage(username, password);

    await inventory.sort.click();
    await inventory.sort.selectOption("za"); // Select "Name (Z to A)"

    const productNames = await page
      .locator(".inventory_item_name")
      .allTextContents();

    expect(productNames).toEqual(productNames.slice().sort().reverse()); // Check descending order
  });

  test("should sort products by price (low to high)", async ({ page }) => {
    const inventory = await new Inventory(page);

    const username = "standard_user";
    const password = "secret_sauce";
    await inventory.navigateToInventoryPage(username, password);

    await inventory.sort.click();
    await inventory.sort.selectOption("lohi"); // Select "Price (low to high)"

    const productPrices = await page
      .locator(".inventory_item_name")
      .allTextContents();

    expect(productPrices).toEqual(productPrices.slice().sort((a, b) => a - b)); // Check ascending order
  });

  test("should sort products by price (high to low)", async ({ page }) => {
    const inventory = await new Inventory(page);

    const username = "standard_user";
    const password = "secret_sauce";
    await inventory.navigateToInventoryPage(username, password);

    await inventory.sort.click();
    await inventory.sort.selectOption("hilo"); // Select "Price (high to low)"

    const productPrices = await page
      .locator(".inventory_item_name")
      .allTextContents();

    expect(productPrices).toEqual(productPrices.slice().sort((a, b) => b - a)); // Check descending order
  });

  test("Logout function", async ({ page }) => {
    const inventory = new Inventory(page);

    const username = "standard_user";
    const password = "secret_sauce";
    await inventory.navigateToInventoryPage(username, password);

    await inventory.menuBar.waitFor();
    await inventory.menuBar.click(); //expand the menu bar
    await inventory.sideBar_logout.waitFor();
    await inventory.sideBar_logout.click(); //logout function execute

    await expect(page.url()).not.toContain("inventory.html");
  });
});
