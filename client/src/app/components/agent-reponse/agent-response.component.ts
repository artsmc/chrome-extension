import { AfterContentInit, Component, ElementRef, OnInit, Injectable, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { faArrowsRotate, faChevronCircleLeft, faChevronDown, faChevronUp, faReply, faRotateRight, faCircleChevronLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft} from '@fortawesome/free-regular-svg-icons';
let CustomerData = {
  message:''
}
@Component({
  selector: 'app-agent-response',
  templateUrl: './agent-response.component.html',
  styleUrls: ['./agent-response.component.scss']
})
export class AgentResponseComponent implements OnInit, AfterContentInit {
  public agentResponseForm!: FormGroup;
  public toneSelectedValue = 'Response tone'
  public feelingSelectedValue: string| boolean   = 'Feeling Allowed';
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
  
  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private elementRef:ElementRef,
    private window: Window
  ) {}

  ngOnInit(): void {
      this.initializeAgentResponseForm()
  }
  ngAfterContentInit(): void {
    this.window.onmessage = function(e) {
        if (e.data && e.data.send && typeof e.data.send === 'string') {
          CustomerData.message = e.data.send;
          console.log(CustomerData);
        }
    };
  }

  private initializeAgentResponseForm(): void {
    this.agentResponseForm = this.formbuilder.group({
      tone: [null, Validators.required],
      customerInquery:[''],
      responseCreated:[''],
      agentContext:[''],
      characterLimit: [null, Validators.required],
      emojiAllowed: [null, Validators.required]
    })
  }

  public generateResponse(): void {
    if(this.window && this.window.top && this.window.top.postMessage){
      this.window.top.postMessage({getTextContent: ''}, '*');
      this.window.onmessage = function(e) {
          if (e.data && e.data.send && typeof e.data.send === 'string') {
            CustomerData.message = e.data.send;
            console.log(CustomerData);
          }
      };
    }
    this.agentResponseForm.patchValue({
      customerInquery: CustomerData.message,
      tone: this.toneSelectedValue
    })
    console.log(this.agentResponseForm.value)
    this.userService.setResponse(this.agentResponseForm.value).subscribe((response: any) => {
      console.log(response);
      this.agentResponseForm.controls['responseCreated'].setValue('');
      this.agentResponseForm.controls['responseCreated'].setValue(response.responseCreated);
      this.isResponseGenerated = true
    })
  }
  public insertResponse(): void {
    if(this.window && this.window.top && this.window.top.postMessage){
      this.window.top.postMessage({recieve: this.agentResponseForm.controls['responseCreated'].value}, '*');
      // reset all values on agentResponseForm
      this.agentResponseForm.controls['responseCreated'].setValue('');
    }
  }
  public getFeelings(feeling: boolean) {
    this.feelingSelectedValue = feeling
  }

  public getTone(tone: string) {
    this.toneSelectedValue = tone
  }

  public refresh(): void {
     if(this.window && this.window.top && this.window.top.postMessage){
      this.window.top.postMessage({getTextContent: ''}, '*');
      this.window.onmessage = function(e) {
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
