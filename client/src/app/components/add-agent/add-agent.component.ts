import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {
  public addAgentForm!: FormGroup;

  constructor(
    private fromBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
      this.initializeAddAgentForm();
  }

  private initializeAddAgentForm(): void {
    this.addAgentForm = this.fromBuilder.group({
      companyName: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      agentName: [null, Validators.required]
    })
  }

  public signup(): void {
    console.log(this.addAgentForm);
  }

}
