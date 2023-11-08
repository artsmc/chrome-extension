class HtmlBase {
  constructor(globals ) {
      this.globals = globals;
      this.callCount = 0;
      this.styles = {
          conversationStyle: { flexDirection: 'row' },
          conversationViewStyle: { width: '80%' },
          appSidebarStyle: {
              border: '1px solid silver',
              maxWidth: '400px',
              width: '100%',
              minWidth: '300px',
              zIndex:20,
              position: 'absolute',
              right:'-100%',
              height: '100%',
              transition:'right 0.4s ease-in-out'
          },
          iframeStyle: {
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
          }
      };
  }
  applyStyles(element, style) {
      Object.keys(style).forEach(key => {
          element.style[key] = style[key];
      });
  }
  init(base) {
    
    const conversation = document.body;
    this.applyStyles(conversation, this.styles.conversationStyle);
    const conversationView = conversation.getElementsByClassName("ember-view")[0];
    this.applyStyles(conversationView, this.styles.conversationViewStyle);
    const appSidebar = document.createElement('div');
    appSidebar.setAttribute('class', 'dashboard-extension-sidebar');
    appSidebar.setAttribute('data-test-id', 'dashboard-extension-sidebar');
    this.applyStyles(appSidebar, this.styles.appSidebarStyle);

    conversation.appendChild(appSidebar);

    const iframe = document.createElement('iframe');
    iframe.setAttribute('class', 'dashboard-extension-iframe');
    iframe.setAttribute('data-test-id', 'dashboard-extension-iframe');
    this.applyStyles(iframe, this.styles.iframeStyle);
    iframe.src = iFrameSrc;
    appSidebar.appendChild(iframe);
    appSidebar.style.right = "0%";
  }
  initContentScript(activeId) {
      this.start();
  }
  start() {
      startBeforePageReady();
      startOnPageReady();
  }
  startBeforePageReady() { }
  startAfterPageReady() { }
  verifyLoadedContent() { 
    return this.insertIconintoToolbar() && this.insertActiveIdConvo();
  }
  startOnPageReady() {
      this.callCount++;
      if(this.callCount <= 8) {
          let intervalId = setInterval(() => {
              if(this.verifyLoadedContent()) {
                this.callCount = 0;
                insertCloseWatch();
                this.startAfterPageReady();
                clearInterval(intervalId);
              }
          }, 1000); 
      }
  }
  insertIconintoToolbar() {
      const element =  document.querySelectorAll("[data-test-id='ticket-editor-app-icon-view']");
      if (typeof(element) != 'undefined' && element != null && element.length > 0) {
          for(let i = 0; i < element.length; i++) {
              this.addIconElement(element[i]);
          }
          return true;
      }
      return false;
  }
  insertActiveIdConvo() {
    const element = document.querySelectorAll("[data-support-suite-trial-onboarding-id='message']");
    if (typeof(element) != 'undefined' && element != null && element.length > 0)
    {
      for(let i = 0; i < element.length; i++) {
        this.addDataId(element[i]);
      }
      return true;
    }
    return false;
  }
  addIconElement(list) {
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
  addDataId(conversation) {
    conversation.setAttribute('data-active-id', activeId);
  }
  insertCloseWatch() {
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
  closeConvo() {
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
}