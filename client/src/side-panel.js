


const iframe = document.createElement('iframe'); 
iframe.style.height = "100%";
iframe.style.backgroundColor = "#fff";
iframe.style.border = "none";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.bottom = "0px";
iframe.style.right = "-20px";
iframe.style.padding = "20px";
iframe.style.zIndex = "9000000000000000000";
iframe.style.display = "flex";
iframe.style.transition = "width 0.5s ease-in-out";
iframe.style.boxShadow = "0px 10px 60px -30px rgba(0, 0, 0, 0.3)";
// in the window.location.hash replace the first # character with /
const hashConverter = window.location.hash.replace("#", "#/");
iframe.src = chrome.runtime.getURL("index.html"+hashConverter);
const docFrame = document.body.appendChild(iframe);
window.onmessage = function(e) {
    if (e.data && e.data.recieve) {
      InboxSDK.load(2, 'sdk_CallcentreAI_e1ee58f410').then(function(sdk){
        sdk.Compose.registerComposeViewHandler(function(composeView){
          composeView.insertTextIntoBodyAtCursor(e.data.recieve);
        });
      });
    }
};
InboxSDK.load(2, 'sdk_CallcentreAI_e1ee58f410').then(function(sdk){
  sdk.Compose.registerComposeViewHandler(function(composeView){
    console.log({composeView, id: composeView.getThreadID()})
    // a compose view has come into existence, do something with it!
    composeView.forceRecipientRowsOpen();
    composeView.ensureFormattingToolbarIsHidden();
    composeView.ensureAppButtonToolbarsAreClosed();
    composeView.on('bodyChanged', function(event) {
      console.log( {event});
      docFrame.contentWindow.postMessage({send:composeView.getTextContent()}, '*');
    });
    composeView.on('cancel', function(event) {
      console.log( {event});
      toggle('close');
    });
    composeView.on('discard', function(event) {
      console.log( {event});
      toggle('close');
    });
    composeView.on('fullscreenChanged', function(event) {
      console.log( {event});
      toggle('close');
    });
    composeView.on('sendCanceled', function(event) {
      console.log( {event});
      toggle('close');
    });
    composeView.addButton({
      title: "AI",
      iconUrl: 'https://png.pngitem.com/pimgs/s/509-5099390_check-green-check-list-icon-hd-png-download.png',
      onClick: function(event) {
        const trimmed = document.querySelectorAll("[data-tooltip='Show trimmed content']");
        for (let i = 0; i < trimmed.length; i++) {
          if(i === trimmed.length - 1) {
            trimmed[i].click();
          }
        }
        docFrame.contentWindow.postMessage({send:composeView.getTextContent()}, '*');
        toggle();
        // event.composeView.insertTextIntoBodyAtCursor('Hello World!');
      },
    });
  });
});
function toggle(state){
    if(state && state == "open"){
      if(iframe.style.width == "0px"){
        iframe.style.width="420px";
        return;
      }
    }
    if(state && state == "close"){
      if(iframe.style.width == "420px"){
        iframe.style.width="0px";
        return;
      }
    }
    if(iframe.style.width == "0px"){
        iframe.style.width="420px";
    }
    else{
        iframe.style.width="0px";
    }
}