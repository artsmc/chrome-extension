import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agent-response',
  templateUrl: './agent-response.component.html',
  styleUrls: ['./agent-response.component.scss']
})
export class AgentResponseComponent implements OnInit {
  public agentResponseForm!: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
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
    
  }

}
