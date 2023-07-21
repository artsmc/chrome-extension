// ```typescript
// import { browser } from 'webextension-polyfill-ts';

// const zendeskDomain = 'https://*.zendesk.com/*';

// // Check if the current page is a Zendesk domain
// function checkForZendeskDomain() {
//   return window.location.href.includes(zendeskDomain);
// }

// // Listen for messages from the background script
// browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'fetchZendeskMessages') {
//     if (checkForZendeskDomain()) {
//       // Fetch customer messages from Zendesk
//       const customerMessages = fetchCustomerMessages();

//       // Send customer messages to the background script
//       sendResponse({ customerMessages });
//     }
//   }
// });

// // Fetch customer messages from Zendesk
// function fetchCustomerMessages() {
//   // TODO: Implement fetching of customer messages from Zendesk
//   return [];
// }
// ```
console.log('here we go112')

// content.js

// Function to create the side panel element
// function createSidePanel() {
//   const sidePanel = document.createElement("div");
//   sidePanel.id = "sidePanel";
//   // Add your content and styles to the side panel here
//   sidePanel.innerHTML = "<h1>Side Panel Content</h1><p>This is the side panel.</p>";

//   document.body.appendChild(sidePanel);
// }

// // Function to toggle the side panel
// function toggleSidePanel() {
//   const sidePanel = document.getElementById("sidePanel");
//   if (!sidePanel) {
//     createSidePanel();
//   } else {
//     sidePanel.remove();
//   }
// }

// // Inject a button to toggle the side panel
// function injectToggleButton() {
//   const button = document.createElement("button");
//   button.id = "toggleButton";
//   button.textContent = "Toggle Side Panel";
//   button.addEventListener("click", toggleSidePanel);
//   document.body.appendChild(button);
// }

// // Execute the function to inject the toggle button when the DOM is ready
// document.addEventListener("DOMContentLoaded", () => {
//   injectToggleButton();
// });


// content.js

// Function to create the side panel element
function createSidePanel() {
  console.log('createSidePanel');
  
  const sidePanel = document.createElement("div");
  sidePanel.id = "sidePanel";
  // Add your content and styles to the side panel here
  sidePanel.innerHTML = "<h1>Side Panel Content</h1><p>This is the side panel.</p>";

  document.body.appendChild(sidePanel);
}

// Function to toggle the side panel
function toggleSidePanel() {
  const sidePanel = document.getElementById("sidePanel");
  if (!sidePanel) {
    createSidePanel();
  } else {
    sidePanel.remove();
  }
}

// Inject a button to toggle the side panel
function injectToggleButton() {
  const button = document.createElement("button");
  button.id = "toggleButton";
  button.textContent = "Toggle Side Panel";
  button.addEventListener("click", toggleSidePanel);
  document.body.appendChild(button);
}

// Execute the function to inject the toggle button when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log('hbdnkfk');
  
  injectToggleButton();
});


// let para = document.getElementsByTagName('p')
// for (const elt of para) {
//   elt.style['background-color'] = '#000'
//   elt.style['color'] = '#fff'
// }

createSidePanel();
injectToggleButton()
toggleSidePanel()

// var iframe = document.createElement('iframe'); 
// iframe.style.background = "#f3f5f3";
// iframe.style.height = "100%";
// iframe.style.width = "400px";
// iframe.style.position = "fixed";
// iframe.style.top = "0px";
// iframe.style.right = "0px";
// iframe.style.zIndex = "9000000000000000000";
// iframe.frameBorder = "none"; 
// iframe.src = "http://localhost:4200/login"
 
// document.body.appendChild(iframe);

// content.js

// Function to create the side panel element
// function createSidePanel() {
//   const sidePanel = document.createElement("div");
//   sidePanel.id = "sidePanel";
//   // Add your content and styles to the side panel here
//   sidePanel.innerHTML = "<h1>Side Panel Content</h1><p>This is the side panel.</p>";

//   document.body.appendChild(sidePanel);
//   console.log(document.body.appendChild(sidePanel));
  
// }