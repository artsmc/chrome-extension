class MemoryState {
  constructor() {
      this.ids = new Map();
      this.activeId = '';
      this.uid = this._getUniqueId();
  }
  init() {
  }
  getIds() {
      return this.ids;
  }
  getActiveUID() {
    return this.activeId;
  }
  getActiveId() {
    const pathArray = window.location.pathname.split('/');
    const windowId = pathArray[3];
    activeId = ids.get(windowId.toString());
    return activeId;
  }
  setActiveId() {
    const pathArray = window.location.pathname.split('/');
    const windowId = pathArray[3];
    // console.log({windowId})
    activeId = this.ids.get(windowId.toString());
    // console.log(ids)
    this.activeId = activeId.uid;
    return activeId.uid;
  }
  createId() {
    this.removeClosedIds();
    const pathArray = window.location.pathname.split('/');
    if(!ids.has(pathArray[3])) {
      let idVal = this.uid;
      ids.set(pathArray[3], {id:pathArray[3],location:window.location.href, uid: idVal, index: ids.size});
      this.activeId = idVal;
    }else {
      const active = ids.get(pathArray[3].toString());
      this.activeId = active.uid;
    }
  }
  removeClosedIds() {
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
  _getUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

new MemoryState();