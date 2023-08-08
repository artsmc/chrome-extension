/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************************************!*\
  !*** ./node_modules/@inboxsdk/core/background.js ***!
  \***************************************************/
/* global chrome */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'inboxsdk__injectPageWorld' && sender.tab) {
    if (chrome.scripting) {
      // MV3
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        world: 'MAIN',
        files: ['pageWorld.js'],
      });
      sendResponse(true);
    } else {
      // MV2 fallback. Tell content script it needs to figure things out.
      sendResponse(false);
    }
  }
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixzQkFBc0I7QUFDeEM7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9JbmJveFNESy8uL25vZGVfbW9kdWxlcy9AaW5ib3hzZGsvY29yZS9iYWNrZ3JvdW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBjaHJvbWUgKi9cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2luYm94c2RrX19pbmplY3RQYWdlV29ybGQnICYmIHNlbmRlci50YWIpIHtcbiAgICBpZiAoY2hyb21lLnNjcmlwdGluZykge1xuICAgICAgLy8gTVYzXG4gICAgICBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgICB0YXJnZXQ6IHsgdGFiSWQ6IHNlbmRlci50YWIuaWQgfSxcbiAgICAgICAgd29ybGQ6ICdNQUlOJyxcbiAgICAgICAgZmlsZXM6IFsncGFnZVdvcmxkLmpzJ10sXG4gICAgICB9KTtcbiAgICAgIHNlbmRSZXNwb25zZSh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTVYyIGZhbGxiYWNrLiBUZWxsIGNvbnRlbnQgc2NyaXB0IGl0IG5lZWRzIHRvIGZpZ3VyZSB0aGluZ3Mgb3V0LlxuICAgICAgc2VuZFJlc3BvbnNlKGZhbHNlKTtcbiAgICB9XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9