import { AfterContentInit, Component, ElementRef, OnInit, Injectable, Inject, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { faArrowsRotate, faCopy, faChevronCircleLeft, faChevronDown, faChevronUp, faReply, faRotateRight, faCircleChevronLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { ZendeskService } from '../../services/zendesk.service';
import { Observable, of } from 'rxjs';
class CustomerData {
    private _message: string = '';
    private _onChange: Function | null = null;
    get message(): string {
        return this._message;
    }
    set message(value: string) {
        this._message = value;
        if (typeof this._onChange === 'function') {
            this._onChange(this._message);
        }
    }
    set onChange(callback: Function) {
        this._onChange = callback;
    }
}
let customerData = new CustomerData();
@Component({
  selector: 'app-agent-response',
  templateUrl: './agent-response.component.html',
  styleUrls: ['./agent-response.component.scss']
})
export class AgentResponseComponent implements OnInit, AfterContentInit {
  public agentResponseForm!: FormGroup;
  public toneSelectedValue = 'Pleasant'
  public feelingSelectedValue: string | boolean = 'Feeling Allowed';
  faRotateRight = faRotateRight;
  faCircleChevronLeft = faCircleChevronLeft;
  faChevronCircleLeft = faCircleChevronLeft;
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faArrowsRotate = faArrowsRotate;
  faReply = faReply;
  faCopy = faCopy;
  toggle = false;
  copied = false;
  isResponseGenerated = false
  isLoading = false;
  isSummaryLoading = false;
  isSentimentLoading = false;
  summary: string| null = null;
  sentiment: string| null= null;
  summ: Observable<string | null> = of(null);
  sent: Observable<string | null> = of(null);
  message: string| null = '';
  agentResponse: string| null = '';
  agentContext: string| null = '';
  messageListener: Observable<string | null> = this.zendeskService.message$;
  stats = 0;
  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private zendeskService: ZendeskService,
    private router: Router,
    private elementRef: ElementRef,
    private window: Window
  ) { 
  }
  ngOnInit(): void {
    this.initializeAgentResponseForm();
    this.zendeskService.getCustomerMessages();
  }
  ngAfterContentInit(): void {
    this.messageListener.subscribe(message => {
      if(message === null) {
        this.restart();
      }
      // console.log({messageListener: message})
      if(message !== this.message) {
        this.reset();
        this.message = message;
        // console.log('message has been reset');
        if(this.message !== null){
          this.patchFormAndValidate();
          this.insertSummarySentiment();
        }
      }
    })
  }

  private initializeAgentResponseForm(): void {
    this.agentResponseForm = this.formbuilder.group({
      tone: ['Pleasant', [Validators.required, Validators.pattern(/^((?!(Response tone)).)*$/)]],
      customerInquery: [''],
      responseCreated: [''],
      agentContext: [''],
      wordLimit: [100, Validators.required],
      emojiAllowed: [null]
    })
  }
  public restart(): void {
    this.agentResponse = null;
    this.agentContext = null;
    this.stats = 0;
    this.reset();
    this.initializeAgentResponseForm();
    this.zendeskService.getCustomerMessages();
  }
  public reset(): void {
    this.zendeskService.getCustomerMessages();
    this.agentResponseForm.reset();
    this.agentResponseForm.patchValue({
      customerInquery:this.message,
      responseCreated: this.agentResponse,
      agentContext: this.agentContext,
      tone: this.toneSelectedValue,
      wordLimit: 100
    });
    if(this.agentResponse === null) {
      this.isResponseGenerated = false;
    }
    this.message = null;
    this.summary = null;
    this.sentiment = null;
  }
  public generateResponse(): void {
    this.agentResponseForm.markAsDirty();
    this.copied = false;
    if (this.window && this.window.top && this.window.top.postMessage) {
      this.window.top.postMessage({ getTextContent: '' }, '*');
    }
    this.agentResponseForm.patchValue({
      customerInquery: this.message,
      tone: this.toneSelectedValue
    })
    if (this.agentResponseForm.invalid) {
      // console.log(this.agentResponseForm)
      return;
    }
    this.isLoading = true;
    this.userService.setResponse(this.agentResponseForm.value).subscribe((response: any) => {
      this.isLoading = false;
      const message = response.split('\n\n').map((item: string) => {
        let itm = item;
        if(!item.includes('data: ') || !item.includes('data:')){
          itm = 'data: \n';
        } 
        itm = itm.replace('data: ', '').replace(',  ', ', ').replace('  ', '\n').replace('  ', '\n').replace('\n', '\n\n');
        return itm;
      }).join('').split('&nbsp;').join('\n\n');
      this.stats = message.trim().split(/\s+/).length;
      this.agentResponse = message;
      this.agentContext = this.agentResponseForm.controls['agentContext'].value;
      this.agentResponseForm.controls['responseCreated'].setValue('');
      this.agentResponseForm.controls['responseCreated'].setValue(message);
      this.isResponseGenerated = true
    }, error => {
      console.log(error);
      this.isLoading = false;
    })
  }

public patchFormAndValidate(): boolean {
  this.zendeskService.getCustomerMessages();
  this.agentResponseForm.patchValue({
    customerInquery:this.message,
    tone: this.toneSelectedValue
  });

  if (this.agentResponseForm.invalid) {
    // console.log(this.agentResponseForm)
    return false;
  }

  return true;
}

public processResponse(response: any): string {
  return response.split('\n\n').map((item: string) => {
    let itm = item;
    if(!item.includes('data: ') || !item.includes('data:')){
      itm = 'data: \n';
    } 
    itm = itm.replace('data: ', '').replace(',  ', ', ').replace('  ', '\n').replace('  ', '\n').replace('\n', '\n\n');
    return itm;
  }).join('').split('&nbsp;').join('\n\n');
}
public insertSummarySentiment(): void {
  this.isSummaryLoading = true;
  this.isSentimentLoading = true;
  this.summ = of(null);
    this.sent = of(null);
  this.userService.setSummarySentiment(this.agentResponseForm.value).subscribe((response: any) => {
    const content = JSON.parse(response.choices[0].message.content);
    this.summary = this.processResponse(content.summary);
    this.sentiment = this.processResponse(content.sentiment);
    this.summ = of(content.summary);
    this.sent = of(content.sentiment);
    this.isSummaryLoading = false;
    this.isSentimentLoading = false;
  });
}

  public insertResponse(): void {
    if (this.window && this.window.top && this.window.top.postMessage) {
      this.window.top.postMessage({ recieve: this.agentResponseForm.controls['responseCreated'].value }, '*');
      this.copied = true;
    }
  }
  public getFeelings(feeling: boolean) {
    this.feelingSelectedValue = feeling
  }

  public getTone(tone: string) {
    this.toneSelectedValue = tone;
    this.agentResponseForm.controls['tone'].setValue(tone);
    this.agentResponseForm.touched;
    this.agentResponseForm.markAsDirty();
  }

  public refresh(): void {
    this.message = null;
    this.zendeskService.getCustomerMessages();
    this.initializeAgentResponseForm();
  }

  public openDropdown(): void {
    const el = document.getElementById('drop-down-list')
    if (el?.style.display === "none" || el?.style.display === "") {
      this.toggle = true
      this.elementRef.nativeElement.querySelector('.drop-down-list').style.display = 'block';
    } else {
      this.toggle = false
      this.elementRef.nativeElement.querySelector('.drop-down-list').style.display = 'none';
    }
  }

}
