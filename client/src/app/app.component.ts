import { Component } from '@angular/core';
import { ZendeskService } from './services/zendesk.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Website Comment Chrome Extension';
  messages: any[] = [];

  constructor(private zendeskService: ZendeskService) {}

  ngOnInit() {
    this.getZendeskMessages();
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
}
