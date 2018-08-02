describe("site", function() {
  it("登录框正常使用", function() {
    browser.waitForAngularEnabled(false);
    browser.get("https://test.com");
    expect(browser.getTitle()).toEqual("Search Listings in Las Vegas - tes");
    $$("nav .sign-icon + li.sign-in").click();
    expect($$(".sign-log").count()).toEqual(1);
    $$(".sign-log input[name=account]").sendKeys("yin@abc.com");
    $$(".sign-log input[name=password]").sendKeys("3345983893");
    $$(".sign-log input[type=submit]").click();
    browser.driver.sleep(1000);
    expect($$(".sign-log").count()).toEqual(0);
  });
});