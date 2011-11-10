(function() {
  window.browser.addMessageListener(function(msg) {
    switch (msg.method) {
      case "asdasd":
        return "asd";
    }
  });
  window.browser.onReady(function() {});
}).call(this);
