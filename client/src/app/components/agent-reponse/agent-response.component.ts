import { AfterContentInit, Component, ElementRef, OnInit, Injectable, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { faArrowsRotate, faCopy, faChevronCircleLeft, faChevronDown, faChevronUp, faReply, faRotateRight, faCircleChevronLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
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
  summary!: string;
  sentiment!: string
  message: string = '';
  stats = 0;
  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private elementRef: ElementRef,
    private window: Window
  ) { 
    this.window.onmessage = function (e) {
      if (e.data && e.data.send && typeof e.data.send === 'string') {
        customerData['message'] = e.data.send;
      }
    };
  }

  ngOnInit(): void {
    this.initializeAgentResponseForm()
  }
  ngAfterContentInit(): void {
    if (this.window && this.window.top && this.window.top.postMessage) {
      this.window.top.postMessage({ getTextContent: '' }, '*');
      this.window.onmessage = function (e) {
        if (e.data && e.data.send && typeof e.data.send === 'string') {
          customerData['message'] = e.data.send;
        }
      };
    }
    customerData.onChange = (message: string) => {
      if(this.message !== message) {
        this.insertSummary();
        this.insertSentiment();
        this.message = message;
      }
    }
  }

  private initializeAgentResponseForm(): void {
    this.agentResponseForm = this.formbuilder.group({
      tone: ['Pleasant', [Validators.required, Validators.pattern(/^((?!(Response tone)).)*$/)]],
      customerInquery: [''],
      responseCreated: [''],
      agentContext: [''],
      wordLimit: [50, Validators.required],
      emojiAllowed: [null]
    })
  }

  public generateResponse(): void {
  this.agentResponseForm.markAsDirty();
  this.copied = false;
    if (this.window && this.window.top && this.window.top.postMessage) {
      this.window.top.postMessage({ getTextContent: '' }, '*');
      this.window.onmessage = function (e) {
        if (e.data && e.data.send && typeof e.data.send === 'string') {
          customerData['message'] = e.data.send;
        }
      };
    }
    this.agentResponseForm.patchValue({
      customerInquery: customerData['message'],
      tone: this.toneSelectedValue
    })
    if (this.agentResponseForm.invalid) {
      console.log(this.agentResponseForm)
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
      this.agentResponseForm.controls['responseCreated'].setValue('');
      this.agentResponseForm.controls['responseCreated'].setValue(message);
      this.isResponseGenerated = true
    }, error => {
      console.log(error);
      this.isLoading = false;
    })
  }
public postMessageAndGetResponse(): void {
  if (this.window && this.window.top && this.window.top.postMessage) {
    this.window.top.postMessage({ getTextContent: '' }, '*');
    this.window.onmessage = function (e) {
      if (e.data && e.data.send && typeof e.data.send === 'string') {
        customerData['message'] = e.data.send;
        console.log(CustomerData);
      }
    };
  }
}

public patchFormAndValidate(): boolean {
  this.agentResponseForm.patchValue({
    customerInquery:customerData['message'],
    tone: this.toneSelectedValue
  });

  if (this.agentResponseForm.invalid) {
    console.log(this.agentResponseForm)
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

public insertSummary(): void {
  this.postMessageAndGetResponse();

  if (!this.patchFormAndValidate()) return;

  this.isSummaryLoading = true;
  this.userService.setSummary(this.agentResponseForm.value).subscribe((response: any) => {
    this.isSummaryLoading = false;
    this.summary = this.processResponse(response);
  });
}

public insertSentiment(): void {
  this.postMessageAndGetResponse();

  if (!this.patchFormAndValidate()) return;

  this.isSentimentLoading = true;
  this.userService.setSentiment(this.agentResponseForm.value).subscribe((response: any) => {
    this.isSentimentLoading = false;
    this.sentiment = this.processResponse(response);
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
    if (this.window && this.window.top && this.window.top.postMessage) {
      this.window.top.postMessage({ getTextContent: '' }, '*');
      this.window.onmessage = function (e) {
        if (e.data && e.data.send && typeof e.data.send === 'string') {
          customerData['message'] = e.data.send;
          console.log(CustomerData);
        }
      };
    }
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
