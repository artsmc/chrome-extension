// console.log('start application')
const hashConverter = window.location.hash.replace("#", "#/");
const iFrameSrc = chrome.runtime.getURL("index.html" + hashConverter);
let callCount = 0;
const ids = new Map();
let activeId = '';
let previousUrl = '';
let state = 'closed';
let currentUrl = window.location.href;
const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
document.addEventListener('click', (event) => {
  // console.log(event)
  setTimeout(() => {
    if (window.location.href.includes('/agent/tickets/') && window.location.pathname.split('/').length <= 4) {
      // console.log('set previousUrl button listener');
      previousUrl = window.location.href;
      createID();
      setActiveId();
      reloadData();
    }
    // console.log('set currentUrl button listener');
    currentUrl = window.location.href;
    // console.log("CLICKED", window.location.href, {currentUrl, previousUrl});
  }, 300);
});
// Handle messages from the iframe
window.onmessage = function(e) {
    if(e.data) {
      // console.log(e.data)
    }
    if (e.data && e.data.recieve) {
      navigator.clipboard.writeText(e.data.recieve);
    }
    if(e.data && e.data.getTextContent!==undefined) {
      reloadData();
    }
    if(e.data && e.data.system) {
      toggle()
    }
};
function addLocationObserver(callback) {
  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: false }
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback)
  // Start observing the target node for configured mutations
  observer.observe(document.body, config)
}
function observerCallback() {
  if (window.location.href.includes('/agent/tickets/') && window.location.href !== previousUrl && window.location.pathname.split('/').length <= 4) {
    // console.log('set previousUrl url obsever');
    previousUrl = currentUrl;
    createID();
    setActiveId();
    initContentScript();
    currentUrl = window.location.href;
  }
}
addLocationObserver(observerCallback)
observerCallback()

function createID() {
  removedClosedIDs();
  const pathArray = window.location.pathname.split('/');
  if(!ids.has(pathArray[3])) {
    let idVal = uid();
    ids.set(pathArray[3], {id:pathArray[3],location:window.location.href, uid: idVal, index: ids.size});
    activeId = idVal;
  }else {
    const active = ids.get(pathArray[3].toString());
    activeId = active.uid;
  }
}
function initContentScript() {
  start();
}
function start() {
  startBeforePageReady();
  startOnPageReady();
}
function startBeforePageReady() {

}
function startOnPageReady() {
  callCount++;
  if(callCount <= 8) {
    let intervalId = setInterval(() => {
      if(insertIconintoToolbar() && insertActiveIdConvo()) {
        insertCloseWatch();
        clearInterval(intervalId);
        callCount = 0;
      }
    }, 1000); 
  }
}
function insertIconintoToolbar() {
  const element =  document.querySelectorAll("[data-test-id='ticket-editor-app-icon-view']");
  if (typeof(element) != 'undefined' && element != null && element.length > 0)
  {
    for(let i = 0; i < element.length; i++) {
      addIconElement(element[i]);
    }
    return true;
  }
  return false;
}
function insertCloseWatch() {
  const activeTab = getActiveId();
  const tabs =  document.querySelectorAll("[role='tablist']");
  if(ids.has(activeTab.id)) {
    if (typeof(tabs) != 'undefined' && tabs != null && tabs.length > 0){
      const activaitedTab = tabs[0].querySelector("[aria-selected='true']");
      if (typeof(activaitedTab) != 'undefined' && activeTab != null) {
        const closebutton =  activaitedTab.querySelector("[data-test-id='close-button']");
        closebutton.addEventListener("click", (event) => {
          closeConvo();
        });
      }
    }
  }
}
function removedClosedIDs() {
  // console.log('check removed IDS');
  const tabs =  document.querySelectorAll("[role='tablist']");
  if (typeof(tabs) != 'undefined' && tabs != null && tabs.length > 0){
    const tabIds = tabs[0].querySelectorAll("[role='tab']");
    if (typeof(tabIds) != 'undefined' && tabIds != null && tabIds.length > 0) {
      const tabValues = [];
      tabIds.forEach(x => {
        tabValues.push(x.getAttribute('data-entity-id'));
      });
      ids.forEach(x => {
        if(!tabValues.includes(x.id)) {
          ids.delete(x.id);
        }
      });
    }
  }
}
function closeConvo() {
  // console.log('CLICKED DELETE', window.location.href, {currentUrl, previousUrl});
  if(ids.size>0){
    getActiveId() ? ids.delete(getActiveId().id) : null;
    setTimeout(() => {
      currentUrl = '';
      // console.log("CLICKED", window.location.href, {currentUrl, previousUrl});
      if (window.location.href.includes('/agent/tickets/') && previousUrl !== currentUrl) {
        // console.log('set previousUrl close click');
        previousUrl = currentUrl;
        setActiveId();
        reloadData();
        insertCloseWatch();
      }
    }, 300);
  } else {
    currentUrl = '';
    // console.log('set previousUrl empty close');
    previousUrl = currentUrl;
  }
}
function insertActiveIdConvo() {
  const element = document.querySelectorAll("[data-support-suite-trial-onboarding-id='message']");
  if (typeof(element) != 'undefined' && element != null && element.length > 0)
  {
    for(let i = 0; i < element.length; i++) {
      addDataId(element[i]);
    }
    return true;
  }
  return false;
}
function getConversationText() {
  let conversation = '';
  const index = getActiveId().index;
  const element = document.querySelectorAll("[data-test-id='omni-log-container']");
  // getconversationInput();
  if (typeof(element) != 'undefined' && element != null && element.length > 0)
  {
    const convo = element[index].querySelectorAll(`[data-active-id='${getActiveId().uid}']`);
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
function getconversationInput() {
  const activeIndex = getActiveId().index;
  const inputBox = document.querySelectorAll("[data-test-id='omnicomposer-rich-text-ckeditor']");
  const insertText = document.createElement('p');
  insertText.innerText = 'Testing inputs from outside of the editor';
  if(inputBox.length>0){
    inputBox[activeIndex].removeAttribute("contenteditable");
    inputBox[activeIndex].appendChild(insertText);
    console.log(inputBox[activeIndex])
  }
}
function addDataId(conversation) {
  conversation.setAttribute('data-active-id', setActiveId());
}
function addIconElement(list) {
  var icon =  list.querySelectorAll("[data-icon='ticket-editor-app-icon']");
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
    appIconButton.myParam = activeId;
    appIconButton.setAttribute('class', 'StyledButton-sc-qe3ace-0 sc-gxiark-0 iWvMow StyledIconButton-sc-1t0ughp-0 cBMPuI');
    appIconButton.addEventListener("click", toggle, false);
    const appIcon = document.createElement('img');
    appIcon.src = chrome.runtime.getURL("/assets/16-mail.png");
    appIconButton.appendChild(appIcon);
    appIconDiv.appendChild(appIconButton);
    appIconWrapper.appendChild(appIconDiv);
    list.appendChild(appIconWrapper);
  }
  return;
}
function reloadData() {
  const activeId = setActiveId();
  initContentScript();
  var appSidebar =  document.querySelectorAll("[data-test-id='dashboard-extension-sidebar']");
  if (appSidebar.length < 1){
    startApplication();
  }
  returnIframe().contentWindow.postMessage({send:getConversationText()}, '*');
}
function toggle() {
  setActiveId();
  var appSidebar =  document.querySelectorAll("[data-test-id='dashboard-extension-sidebar']");
  if (appSidebar.length < 1){
    startApplication()
  } else {
    if(appSidebar[0].style.right !== "-100%"){
      appSidebar[0].style.right = "-100%";
      state = 'closed';
    }else {
      returnIframe().contentWindow.postMessage({send:getConversationText()}, '*');
      appSidebar[0].style.right = "0%";
      state = 'open';
    }
  }
}
function setActiveId() {
  const pathArray = window.location.pathname.split('/');
  const windowId = pathArray[3];
  // console.log({windowId})
  activeId = ids.get(windowId.toString());
  // console.log(ids)
  return activeId.uid;
}
function getActiveId() {
  const pathArray = window.location.pathname.split('/');
  const windowId = pathArray[3];
  activeId = ids.get(windowId.toString());
  return activeId;
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
  conversation.appendChild(appSidebar);
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
  appSidebar.appendChild(iframe);
  appSidebar.style.right = "0%";
}
function returnIframe() {
  const docFrame = document.querySelectorAll("[data-test-id='dashboard-extension-iframe']");
  return docFrame[0];
}