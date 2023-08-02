import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { faArrowsRotate, faChevronCircleLeft, faChevronDown, faChevronUp, faCircleChevronLeft, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-agent-response',
  templateUrl: './agent-response.component.html',
  styleUrls: ['./agent-response.component.scss']
})
export class AgentResponseComponent implements OnInit {
  public agentResponseForm!: FormGroup;
  public toneSelectedValue = 'Response tone'
  public feelingSelectedValue: string| boolean   = 'Feeling Allowed';
  faRotateRight = faRotateRight;
  faCircleChevronLeft = faCircleChevronLeft
  faChevronCircleLeft = faChevronCircleLeft
  faArrowAltCircleLeft = faArrowAltCircleLeft
  faChevronUp = faChevronUp
  faChevronDown = faChevronDown
  faArrowsRotate = faArrowsRotate
  toggle = false
  isResponseGenerated = false
  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private elementRef:ElementRef
  ) {}

  ngOnInit(): void {
      this.initializeAgentResponseForm()
  }

  private initializeAgentResponseForm(): void {
    this.agentResponseForm = this.formbuilder.group({
      customerInquery:[''],
      responseCreated:[''],
      agentContext:[''],
      charLimit: [null, Validators.required],
      emoji: [null, Validators.required]
    })
  }

  public generateResponse(): void {
    console.log(this.agentResponseForm);
    this.userService.setResponse(this.toneSelectedValue, this.agentResponseForm.value.emoji, this.agentResponseForm.value.charLimit, this.toneSelectedValue).subscribe((response: any) => {
      console.log(response);
      this.agentResponseForm.controls['responseCreated'].setValue('');
      this.agentResponseForm.controls['responseCreated'].setValue(response.responseCreated);
      this.isResponseGenerated = true
    })
    
  }

  public getFeelings(feeling: boolean) {
    this.feelingSelectedValue = feeling
  }

  public getTone(tone: string) {
    this.toneSelectedValue = tone
  }

  public refresh(): void {
    console.log('refresh');
    
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
