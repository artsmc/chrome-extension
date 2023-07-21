chrome.action.onClicked.addListener(tab => {

  chrome.tabs.sendMessage(tab.id,"toggle");
  console.log(tab, 'message sent');
});