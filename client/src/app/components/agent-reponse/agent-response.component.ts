import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-agent-response',
  templateUrl: './agent-response.component.html',
  styleUrls: ['./agent-response.component.scss']
})
export class AgentResponseComponent implements OnInit {
  public agentResponseForm!: FormGroup;
  public toneSelectedValue = 'Select Tone'
  public feelingSelectedValue: string| boolean   = 'Feeling Allowed';
  faRotateRight = faRotateRight;
  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
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
    })
    
  }

  public getFeelings(feeling: boolean) {
    this.feelingSelectedValue = feeling
  }

  public getTone(tone: string) {
    this.toneSelectedValue = tone
  }

}
