import { Component, HostListener, ViewChild } from '@angular/core';
import { ZendeskService } from './services/zendesk.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { Observable, first } from 'rxjs';
// // @ts-ignore
// import * as $ from 'jquery';
// // @ts-ignore
// import * as GmailFactory  from 'gmail-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Website Comment Chrome Extension';
  @ViewChild("offcanvasRight") offcanvasRight: any;
  private offcanvasElement: any
  public isOffcanvasOpen = false;
  messageSender: Observable<string | null> = this.zendeskService.message$;
  // public _gmailjs = new GmailFactory.Gmail($);
  constructor(private zendeskService: ZendeskService,
    private route: Router,
    private userService: UserService,
    private window: Window
  ) { }
  @HostListener('window:message', ['$event']) onMessage(e:any) {
    console.log(e.data)
    if (e.data && e.data.send && typeof e.data.send === 'string') {
      this.zendeskService.updateMessage(e.data.send);
    }
  }
  public ngOnInit(): void {
    const user = this.userService.getUserValue();
    this.messageSender.pipe(first()).subscribe((message) => {
    console.log('send message')
    if(this.window && this.window.top && this.window.top.postMessage){
      this.window.top.postMessage({ getTextContent: '' }, '*');
    }
    });
    if(user) {
      this.userService.verify().subscribe((response) => {
        this.route.navigate(['/response']);
      }, fail => {
        this.userService.logout();
        this.route.navigate(['/']);
      });
    }
  }
  ngAfterViewInit(): void {
  }
  public toggle(): void {
    this.zendeskService.resetMessage();
    if(this.window && this.window.top && this.window.top.postMessage){
      this.window.top.postMessage({system: 'close'}, '*');
    }
  }
  getZendeskMessages() {
    if(this.window && this.window.top && this.window.top.postMessage){
      this.window.top.postMessage({ getTextContent: '' }, '*');
    }
  }

}
