import * as InboxSDK from '@inboxsdk/core';

const iframe = document.createElement('iframe');
const styles = {
  height: "100%",
  backgroundColor: "#fff",
  border: "none",
  width: "0px",
  position: "fixed",
  top: "0px",
  bottom: "0px",
  right: "-20px",
  padding: "20px",
  zIndex: "9000000000000000000",
  display: "flex",
  transition: "width 0.5s ease-in-out",
  boxShadow: "0px 10px 60px -30px rgba(0, 0, 0, 0.3)"
};
Object.keys(styles).forEach(key => {
  iframe.style[key] = styles[key];
});
const hashConverter = window.location.hash.replace("#", "#/");
iframe.src = chrome.runtime.getURL("index.html" + hashConverter);
const docFrame = document.body.appendChild(iframe);


// Handle messages from the iframe
window.onmessage = function(e) {
    if (e.data && e.data.recieve) {
      InboxSDK.load(2, 'sdk_CallcentreAI_e1ee58f410').then(function(sdk){
        sdk.Compose.registerComposeViewHandler(function(composeView){
          composeView.insertTextIntoBodyAtCursor(e.data.recieve);
        });
      });
    }
    if(e.data && e.data.getTextContent) {
      InboxSDK.load(2, 'sdk_CallcentreAI_e1ee58f410').then(function(sdk){
        sdk.Compose.registerComposeViewHandler(function(composeView){
          docFrame.contentWindow.postMessage({send:composeView.getTextContent()}, '*');
        });
      });
    }
    if(e.data && e.data.system) {
      toggle(e.data.system)
    }
};

// Load Application inside gmail
InboxSDK.load(2, 'sdk_CallcentreAI_e1ee58f410').then(function(sdk){
  sdk.Router.handleAllRoutes( (RouteView) => {
    toggle('close');  
  });
  sdk.Compose.registerComposeViewHandler(function(composeView){
    // a compose view has come into existence, do something with it!
    composeView.on('bodyChanged', function(event) {
      docFrame.contentWindow.postMessage({send:composeView.getTextContent()}, '*');
    });
    composeView.on('cancel', function(event) {
      toggle('close');
    });
    composeView.on('discard', function(event) {
      toggle('close');
    });
    composeView.addButton({
      title: "AI Zendesk Assistant by Callcentre.ai",
      iconUrl: 'https://s3.us-east-2.amazonaws.com/email.melville.app/angels/16-mail.png',
      onClick: function(event) {
        const trimmed = document.querySelectorAll("[data-tooltip='Show trimmed content']");
        for (let i = 0; i < trimmed.length; i++) {
          if(i === trimmed.length - 1) {
            trimmed[i].click();
          }
        }
        docFrame.contentWindow.postMessage({send:composeView.getTextContent()}, '*');
        toggle();
      },
    });
  });
});

// Change application state
function toggle(state){
    if (state === "open") {
      if(iframe.style.width === "0px"){
        iframe.style.width = "420px";
      }
      return;
    } else if (state === "close") {
      if(iframe.style.width === "420px") {
        iframe.style.width = "0px";
      }
      return;
    }
    if(!state) {
      iframe.style.width = iframe.style.width === "0px" ? "420px" : "0px";
    }
}