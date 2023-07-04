```typescript
import { browser } from 'webextension-polyfill-ts';

document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('message-input') as HTMLInputElement;
  const sendButton = document.getElementById('send-button') as HTMLButtonElement;

  sendButton.addEventListener('click', async () => {
    const message = messageInput.value;
    if (message) {
      const response = await browser.runtime.sendMessage({ type: 'SEND_MESSAGE', payload: message });
      if (response) {
        const responseElement = document.getElementById('response') as HTMLDivElement;
        responseElement.textContent = response;
      }
    }
  });
});
```