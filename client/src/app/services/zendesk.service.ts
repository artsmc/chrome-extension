import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZendeskService {
  private zendeskApiUrl = 'https://your-zendesk-api-url';
  private message: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  message$: Observable<string | null> = this.message.asObservable();
  private postMessage: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  postMessage$: Observable<string | null> = this.postMessage.asObservable();

  constructor(
    // private http: HttpClient
    ) { }
  resetMessage(): void {
    this.message.next(null);
    this.postMessage.next(null);
  }
  updateMessage(message: string): void {
    this.message.next(message);
  }
  getCustomerMessages(): void {
    this.postMessage.next('');
  }

  sendReply(ticketId: string, reply: string): any
  // Observable<any> 
  {
    // return this.http.post(`${this.zendeskApiUrl}/tickets/${ticketId}/reply`, { text: reply });
  }
}
