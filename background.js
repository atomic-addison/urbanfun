chrome.browserAction.onClicked.addListener(function() {
  let newTab = chrome.tabs.create({
    url:"http://urbandead.com/map.cgi"
  });
  //newTab.then(onCreated, onError);
});
