import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {
  public addAgentForm!: FormGroup;
  private subscriptions: Subscription[] = [];
  public submitted = false
  public isAgentSection = true

  constructor(
    private fromBuilder: FormBuilder,
    private router: ActivatedRoute,
    private route: Router,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
      this.initializeAddAgentForm();
      // if (localStorage.getItem('token')) {
      //   this.route.navigate(['/signup']);
      // }
  }

  // convenience getter for easy access to form fields

  get f() {
    return this.addAgentForm.controls;
  }

  private initializeAddAgentForm(): void {
    this.addAgentForm = this.fromBuilder.group({
      companyName: ['', Validators.required],
      // email: [null, Validators.compose([Validators.required, Validators.email])],
      agentName: [null, Validators.required]
    })
  }

  public signup(): void {
    this.submitted = true;
    if (this.addAgentForm.invalid) {
      return;
    }
    this.userService.updateUser(this.addAgentForm.value.agentName, this.addAgentForm.value.companyName).subscribe((res) => {
    //   console.log(res);
      this.isAgentSection = false
      this.route.navigate(['/response'])
    })
    // this.route.navigate(['/response'])
  }

}
