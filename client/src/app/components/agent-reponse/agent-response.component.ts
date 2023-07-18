import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-agent-response',
  templateUrl: './agent-response.component.html',
  styleUrls: ['./agent-response.component.scss']
})
export class AgentResponseComponent implements OnInit {
  public agentResponseForm!: FormGroup;
  public toneSelectedValue = 'Select Tone'
  public feelingSelectedValue = 'Select Feeling'

  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
      this.initializeAgentResponseForm()
  }

  private initializeAgentResponseForm(): void {
    this.agentResponseForm = this.formbuilder.group({
      charLimit: [null, Validators.required],
      emoji: [null, Validators.required]
    })
  }

  public generateResponse(): void {
    console.log(this.agentResponseForm);
    this.userService.setResponse(this.toneSelectedValue, this.agentResponseForm.value.emoji, this.agentResponseForm.value.charLimit, this.toneSelectedValue).subscribe((response: any) => {
      console.log(response);
      
    })
    
  }

  public getFeelings(feeling: string) {
    this.feelingSelectedValue = feeling
  }

  public getTone(tone: string) {
    this.toneSelectedValue = tone
  }

}
