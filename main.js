chrome.app.runtime.onLaunched.addListener(() => {
  const width = 1220;
  const height = 1000;
  chrome.app.window.create("index.html", {
    id: "yafp",
    bounds: {
      width: width,
      height: height,
    }
  });
});
