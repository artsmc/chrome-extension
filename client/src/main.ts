import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { TAB_ID } from './app/providers/tab-id.provider';
// @ts-ignore
// chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//   if (environment.production) {
//     enableProdMode();
//   }
// // @ts-ignore
//   const { id: tabId } = [...tabs].pop();

//   // provides the current Tab ID so you can send messages to the content page
//   platformBrowserDynamic([{ provide: TAB_ID, useValue: tabId }])
//     .bootstrapModule(AppModule)
//     .catch(error => console.error(error));
// });
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
