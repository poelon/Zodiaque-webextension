function action() {
  browser.tabs.create({url: '../html/zodiaque.html'});
}

browser.browserAction.onClicked.addListener(action);
