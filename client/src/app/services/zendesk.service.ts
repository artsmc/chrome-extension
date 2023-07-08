import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZendeskService {
  private zendeskApiUrl = 'https://your-zendesk-api-url';

  constructor(
    // private http: HttpClient
    ) { }

  getCustomerMessages(ticketId: string): any
  // Observable<any> 
  {
    // return this.http.get(`${this.zendeskApiUrl}/tickets/${ticketId}/messages`);
    return 'sdcffer'
  }

  sendReply(ticketId: string, reply: string): any
  // Observable<any> 
  {
    // return this.http.post(`${this.zendeskApiUrl}/tickets/${ticketId}/reply`, { text: reply });
  }
}
