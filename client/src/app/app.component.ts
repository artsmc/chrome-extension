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
    private userService: UserService
  ) { }

  public ngOnInit(): void {
     const user = this.userService.getUserValue();
     if(user) {
      this.userService.verify().subscribe((response) => {
        localStorage.setItem('token', response?.token);
        this.route.navigate(['/response']);
      }, fail => {
        this.userService.logout();
        this.route.navigate(['/']);
      });
    }
  }

  ngAfterViewInit(): void {
  }
//   startExtension(gmail:any): void {
//     console.log("Extension loading...");
//     (<any>window).gmail = gmail;

//     gmail.observe.on("load", () => {
//         const userEmail = gmail.get.user_email();
//         console.log("Hello, " + userEmail + ". This is your extension talking!");

//         gmail.observe.on("view_email", (domEmail: any) => {
//             console.log("Looking at email:", domEmail);
//             const emailData = gmail.new.get.email_data(domEmail);
//             console.log("Email data:", emailData);
//         });

//         gmail.observe.on("compose", (compose: any) => {
//             console.log("New compose window is opened!", compose);
//         });
//     });
// }

  getZendeskMessages() {
  }



  public setState(): void {
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
