import { Component, ViewChild } from '@angular/core';
import { ZendeskService } from './services/zendesk.service';

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
    ) {}

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

  // openOffCanvas(): void {
  //   let canvas = document.getElementById('offcanvasRight')
  //   // canvas?.setAttribute("class", "democlass");
  //   // canvas.hide
  //   this.isOffcanvasOpen = true;
  //   const offcanvas = this.offcanvasRight?.nativeElement;
  //   // const offcanvasModal = new bootstrap.Offcanvas(offcanvas);
  //   // offcanvasModal.show();
  //   console.log(offcanvas), this.offcanvasRight;
    
  //   offcanvas.show()
  // }

  // public toggleOffcanvas(): void {
  //   this.isOffcanvasOpen = !this.isOffcanvasOpen;
  // }
}
