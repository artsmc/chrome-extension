import { Component, ViewChild } from '@angular/core';
import { ZendeskService } from './services/zendesk.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Website Comment Chrome Extension';
  messages: any[] = [];
  @ViewChild("offcanvasRight") offcanvasRight: any;
  private offcanvasElement: any
  public isOffcanvasOpen = false;

  constructor(private zendeskService: ZendeskService,
    private route: Router,
    private userService: UserService
  ) { }

public ngOnInit(): void {
    // @ts-ignore
    chrome.tabs.executeScript({
      code: `
      (function(){
      const iframe = document.createElement('iframe');
      iframe.src = chrome.runtime.getURL('index.html');
      iframe.style.cssText = 'position:fixed;top:0;left:0;display:block;' +
        'width:300px;height:100%;z-index:1000;';
      document.body.appendChild(iframe);
    })(); `
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log('LOCATION', this.route.url);
  }

  getZendeskMessages() {
    // this.zendeskService.getMessages().subscribe((data: any[]) => {
    //   this.messages = data;
    // });
  }

  sendOpenAIResponse(message: string) {
    // this.zendeskService.sendResponse(message).subscribe((response: any) => {
    // Insert the OpenAI response into the Zendesk reply
    // this.zendeskService.insertReply(response).subscribe();
    // });
  }


  public setState(): void {
    // console.log(localStorage.getItem('panelOpen'));
    // const val = localStorage.getItem('panelOpen')
    if (this.userService.isPanelOpen) {
      localStorage.setItem('panelOpen', 'false');
      this.userService.isPanelOpen.next(false)
    } else{
      localStorage.setItem('panelOpen', 'true');
      // this.userService.isPanelOpen.next(true);
      this.userService.isPanelOpen
    }

  }
}
