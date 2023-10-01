import { ClickObserver } from './application/click-observer.js';
import { MemoryState } from './application/in-app-state.js';
import { HtmlBase } from './application/html-base.js';

class ChromeExtensionApplication {
  constructor() {
    this.hashConverter = window.location.hash.replace("#", "#/");
    this.iFrameSrc = chrome.runtime.getURL("index.html" + this.hashConverter);

    this.clickObserver = new ClickObserver({ callback: this.clickCallback() });
    this.locationObserver = new LocationObserver();
    this.stateManager = new MemoryState();
    this.base = new HtmlBase({
      stateManager: this.stateManager,
      clickObserver: this.clickObserver,
      locationObserver: this.locationObserver
    });

    this.globals = {
      previousUrl: '',
      state: 'closed',
      currentUrl: window.location.href,
      version: '1.0.4'
    };

    this._initialize();
  }

  getVersion() {
    return this.globals.version;
  }

  _initialize() {
    this.clickObserver.handleClickEvent();
    this.locationObserver.observeHrefChanges();
    this.initMessageHandler();
    this.base.init(this.iFrameSrc);
  }

  initMessageHandler(){
    window.onmessage = (e) => {
      if(e.data) {
        this.handleMessageData(e.data);
      }
    };
  }

  handleMessageData(data){
    if(data.recieve) {
      navigator.clipboard.writeText(data.recieve);
    }
    if(data.getTextContent!==undefined) {
      this.reloadData();
    }
    if(data.system) {
      this.toggle()
    }
  }

  reloadData() {
    // implementation for reloadData
  }

  toggle() {
    // implementation for toggle
  }

  clickCallback() {
    if (window.location.href.includes('/agent/tickets/') && window.location.pathname.split('/').length <= 4) {
      this.globals.previousUrl = window.location.href;
      this.stateManager.createID();
      this.stateManager.setActiveId();
    }
  }
}

window.aiAssist = new ChromeExtensionApplication();