import { Component, ViewChild } from '@angular/core';
import { ZendeskService } from './services/zendesk.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
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
  messages: any[] = [];
  @ViewChild("offcanvasRight") offcanvasRight: any;
  private offcanvasElement: any
  public isOffcanvasOpen = false;
  // public _gmailjs = new GmailFactory.Gmail($);
  constructor(private zendeskService: ZendeskService,
    private route: Router,
    private userService: UserService,
    private window: Window
  ) { }

  public ngOnInit(): void {
     const user = this.userService.getUserValue();
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
    if(this.window && this.window.top && this.window.top.postMessage){
      this.window.top.postMessage({system: 'close'}, '*');
    }
  }
  getZendeskMessages() {
  }

}
