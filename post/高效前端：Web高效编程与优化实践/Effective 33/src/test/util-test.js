describe("reverse", function() {
  it("reverse word", function() {
    expect(util.reverse("abc")).toEqual("cba");
  });

  it("reverse字符串长度为1时返回自已", function() {
    expect(util.reverse("a")).toBe("a");
  });

  it("reverse传值不是字符串时会抛异常", function() {
    expect(function() {
      util.reverse(null)
    }).toThrow();
  });
});