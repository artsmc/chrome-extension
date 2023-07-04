```typescript
import { chrome } from 'chrome';

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'www.zendesk.com' },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchOpenAIResponse') {
    fetch('http://localhost:3000/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: request.message }),
    })
      .then(response => response.json())
      .then(data => {
        sendResponse({ openAIResponse: data.response });
      })
      .catch(error => {
        console.error('Error:', error);
      });
    return true;  // Will respond asynchronously.
  }
});
```