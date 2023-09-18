const hashConverter = window.location.hash.replace("#", "#/");
const iFrameSrc = chrome.runtime.getURL("index.html" + hashConverter);
// console.log('start application')
let initiated = false;
let callCount = 0;
// Handle messages from the iframe
window.onmessage = function(e) {
    if(e.data) {
    }
    if (e.data && e.data.recieve) {
      // console.log(e.data.recieve)
      // const insertBox = getReplyBox();
      // const reply = document.createElement('p');
      // reply.innerHTML = e.data.recieve;
      // insertBox.innerHTML +=e.data.recieve;
      navigator.clipboard.writeText(e.data.recieve);
    }
    if(e.data && e.data.getTextContent!==undefined) {
      returnIframe().contentWindow.postMessage({send:getConversationText()}, '*');
    }
    if(e.data && e.data.system) {
      toggle()
    }
};
function addLocationObserver(callback) {

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: false }

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback)

  // Start observing the target node for configured mutations
  observer.observe(document.body, config)
}
function observerCallback() {
  if (window.location.href.includes('/agent/tickets/')) {
    console.log('contenet ready', window.location.href)
    initContentScript();
  }
}
addLocationObserver(observerCallback)
observerCallback()

function initContentScript() {
  initiated = true;
  start();
}
function start() {
  startBeforePageReady();
  startOnPageReady();
}
function startBeforePageReady() {

}
function startOnPageReady() {
  initiated = false;
      callCount++;
      if(callCount <= 8) {
        let intervalId = setInterval(() => {
          // Assumes insertIconintoToolbar() returns true when successful
          if(insertIconintoToolbar()) {
            clearInterval(intervalId);
          }
        }, 1000); 
        callCount = 0;
      }
}
function insertIconintoToolbar() {
  const element =  document.querySelectorAll("[data-test-id='ticket-editor-app-icon-view']");
  if (typeof(element) != 'undefined' && element != null && element.length > 0)
  {
    // console.log('add to toolbar SUCCESSFUL');
    addIconElement(element[0]);
    return true;
  }
  return false;
}
function getConversationText() {
  let conversation = '';
  const element = document.querySelectorAll("[aria-label='conversationLabel']");
  if (typeof(element) != 'undefined' && element != null && element.length > 0)
  {
    const convo = element[0].querySelectorAll('span.mount-point-wrapper');
    for(let i = 0; i < convo.length; i++) {
      
      conversation += convo[i].innerText;
      conversation += '\n\n';
      conversation += '-------------------------';
      conversation += '\n\n';
    }
    return conversation;
  }
  console.error('message element not found');
  return;
}
function getReplyBox() {
  const element = document.querySelectorAll("[aria-label='Public reply composer']");
  if (typeof(element) != 'undefined' && element != null && element.length > 0)
  {
    // console.log(element[0].querySelector('p'))
    return element[0];
  }
  console.error('message element not found');
  return;
}
function addIconElement(list) {
  var icon =  document.querySelectorAll("[data-icon='ticket-editor-app-icon']");
  // console.log(callCount);
  if (icon.length < 1)
  {
    const appIconWrapper = document.createElement('li');
    appIconWrapper.setAttribute('data-icon', 'ticket-editor-app-icon');
    const appIconDiv = document.createElement('div');
    const appIconButton = document.createElement('button');
    appIconButton.setAttribute('data-garden-version', '8.69.11');
    appIconButton.setAttribute('type', 'button');
    appIconButton.setAttribute('aria-label', 'Use AI to answer this ticket');
    appIconButton.setAttribute('data-test-id', 'ticket-composer-toolbar-link-button');
    appIconButton.setAttribute('data-active', 'false');
    appIconButton.setAttribute('data-cy', '');
    appIconButton.setAttribute('title', '');
    appIconButton.setAttribute('tabindex', '0');
    appIconButton.setAttribute('aria-describedby', '83val-tooltip_1.0.6');
    appIconButton.setAttribute('data-garden-container-id', 'containers.tooltip');
    appIconButton.setAttribute('data-garden-container-version', '1.0.6');
    appIconButton.setAttribute('class', 'StyledButton-sc-qe3ace-0 sc-gxiark-0 iWvMow StyledIconButton-sc-1t0ughp-0 cBMPuI');
    appIconButton.addEventListener("click", toggle);
    const appIcon = document.createElement('img');
    appIcon.src = chrome.runtime.getURL("/assets/16-mail.png");
    appIconButton.appendChild(appIcon);
    appIconDiv.appendChild(appIconButton);
    appIconWrapper.appendChild(appIconDiv);
    list.appendChild(appIconWrapper);
  }
  return;
}
function toggle(system) {
  var appSidebar =  document.querySelectorAll("[data-test-id='dashboard-extension-sidebar']");
  if (appSidebar.length < 1){
    startApplication()
  } else {
    if(appSidebar[0].style.right !== "-100%"){
      appSidebar[0].style.right = "-100%";
    }else {
      appSidebar[0].style.right = "0%";
    }
  }
}
function startApplication(){
  const conversation = document.body;
  const conversationStyle = {
    flexDirection: 'row'
  }
  Object.keys(conversationStyle).forEach(key => {
    conversation.style[key] = conversationStyle[key];
  });
  const conversationView = conversation.getElementsByClassName("ember-view")[0];
  const conversationViewStyle = {
    width: '80%'
  }
  Object.keys(conversationViewStyle).forEach(key => {
    conversationView.style[key] = conversationViewStyle[key];
  });
  const appSidebar = document.createElement('div');
  appSidebar.setAttribute('class', 'dashboard-extension-sidebar');
  appSidebar.setAttribute('data-test-id', 'dashboard-extension-sidebar');
  const appSidebarStyle = {
      border: '1px solid silver',
      maxWidth: '400px',
      width: '100%',
      minWidth: '300px',
      zIndex:20,
      position: 'absolute',
      right:'-100%',
      height: '100%',
      transition:'right 0.4s ease-in-out'
      
  }
  Object.keys(appSidebarStyle).forEach(key => {
    appSidebar.style[key] = appSidebarStyle[key];
  });
  const conversationFrame = conversation.appendChild(appSidebar);
  const iframe = document.createElement('iframe');
  iframe.setAttribute('class', 'dashboard-extension-iframe');
  iframe.setAttribute('data-test-id', 'dashboard-extension-iframe');
  const styles = {
    height: "100%",
    backgroundColor: "#fff",
    border: "none",
    width: "100%",
    position: "relative",
    top: "0px",
    bottom: "0px",
    padding: "0px",
    display: "flex",
    transition: "width 0.5s ease-in-out",
    boxShadow: "0px 10px 60px -30px rgba(0, 0, 0, 0.3)"
  };
  Object.keys(styles).forEach(key => {
    iframe.style[key] = styles[key];
  });
  iframe.src = iFrameSrc;
  const docFrame = appSidebar.appendChild(iframe);
  appSidebar.style.right = "0%";
  iframe.contentWindow.postMessage({send:getConversationText()}, '*');
}
function returnIframe() {
  const docFrame = document.querySelectorAll("[data-test-id='dashboard-extension-iframe']");
  return docFrame[0];
}