```typescript
import { browser } from 'webextension-polyfill-ts';

const zendeskDomain = 'https://*.zendesk.com/*';

// Check if the current page is a Zendesk domain
function checkForZendeskDomain() {
  return window.location.href.includes(zendeskDomain);
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchZendeskMessages') {
    if (checkForZendeskDomain()) {
      // Fetch customer messages from Zendesk
      const customerMessages = fetchCustomerMessages();

      // Send customer messages to the background script
      sendResponse({ customerMessages });
    }
  }
});

// Fetch customer messages from Zendesk
function fetchCustomerMessages() {
  // TODO: Implement fetching of customer messages from Zendesk
  return [];
}
```