import { Component, OnInit } from '@angular/core';
import { ZendeskService } from 'src/app/services/zendesk.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  public messages: any[] = [];
  openaiResponse = 'anc'
  constructor(
    private zendeskService: ZendeskService
    ) { }

    ngOnInit(): void {
      this.loadMessages();
    }

    loadMessages(): void {
      // this.zendeskService.getMessages().subscribe((data: any[]) => {
      //   this.messages = data;
      // });
    }
  
    sendReply(messageId: string, replyText: string): void {
      this.zendeskService.sendReply(messageId, replyText).subscribe(() => {
        this.loadMessages();
      });
    }

}
