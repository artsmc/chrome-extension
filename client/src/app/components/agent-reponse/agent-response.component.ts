import { AfterContentInit, Component, ElementRef, OnInit, Injectable, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { faArrowsRotate, faChevronCircleLeft, faChevronDown, faChevronUp, faReply, faRotateRight, faCircleChevronLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
let CustomerData = {
  message: '',
  reset: false
}
@Component({
  selector: 'app-agent-response',
  templateUrl: './agent-response.component.html',
  styleUrls: ['./agent-response.component.scss']
})
export class AgentResponseComponent implements OnInit, AfterContentInit {
  public agentResponseForm!: FormGroup;
  public toneSelectedValue = 'Response tone'
  public feelingSelectedValue: string | boolean = 'Feeling Allowed';
  faRotateRight = faRotateRight;
  faCircleChevronLeft = faCircleChevronLeft;
  faChevronCircleLeft = faCircleChevronLeft;
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faArrowsRotate = faArrowsRotate;
  faReply = faReply;
  toggle = false
  isResponseGenerated = false
  isLoading = false;
  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private elementRef: ElementRef,
    private window: Window
  ) { }

  ngOnInit(): void {
    this.initializeAgentResponseForm();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          if (CustomerData.reset) {
            this.resetPage();
            CustomerData.reset = false;
          }
          this.agentResponseForm.controls['customerInquery'].setValue(CustomerData.message);
        }
      });
    });
  }
  ngAfterContentInit(): void {
    this.window.onmessage = function (e) {
      if (e.data && e.data.send && typeof e.data.send === 'string') {
        CustomerData.message = e.data.send;
        console.log(CustomerData);
      }
      if (e.data && e.data.clear) {
        CustomerData.reset = true;
      }
    };
    //create a vanilla js observer that watches for changes to the CustomerData object
  }

  private initializeAgentResponseForm(): void {
    this.agentResponseForm = this.formbuilder.group({
      tone: [null, [Validators.required, Validators.pattern(/^((?!(Response tone)).)*$/)]],
      customerInquery: [''],
      responseCreated: [''],
      agentContext: [''],
      characterLimit: [null, Validators.required],
      emojiAllowed: [null]
    })
  }
  resetPage(): void {
    this.agentResponseForm.reset();
    this.isLoading = false;
    this.toneSelectedValue = 'Response tone';
    this.isResponseGenerated = false;
  }
  public generateResponse(): void {
    this.agentResponseForm.markAsDirty();
    if (this.window && this.window.top && this.window.top.postMessage) {
      this.window.top.postMessage({ getTextContent: '' }, '*');
      this.window.onmessage = function (e) {
        if (e.data && e.data.send && typeof e.data.send === 'string') {
          CustomerData.message = e.data.send;
          console.log(CustomerData);
        }
      };
    }
    this.agentResponseForm.patchValue({
      customerInquery: CustomerData.message,
      tone: this.toneSelectedValue
    });
    if (this.agentResponseForm.invalid) {
      console.log(this.agentResponseForm)
      return;
    }
    console.log(this.agentResponseForm.value)
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
      this.agentResponseForm.controls['responseCreated'].setValue('');
      this.agentResponseForm.controls['responseCreated'].setValue(message);
      this.isResponseGenerated = true
    }, error => {
      console.log(error);
      this.isLoading = false;
    })
  }
  public insertResponse(): void {
    if (this.window && this.window.top && this.window.top.postMessage) {
      this.window.top.postMessage({ recieve: this.agentResponseForm.controls['responseCreated'].value }, '*');
      // reset all values on agentResponseForm
      this.agentResponseForm.controls['responseCreated'].setValue('');
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
          CustomerData.message = e.data.send;
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
