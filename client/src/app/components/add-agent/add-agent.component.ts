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

  constructor(
    private fromBuilder: FormBuilder,
    private router: ActivatedRoute,
    private route: Router,
    private userService: UserService
  ) {
    this.router.queryParams
      .subscribe(params => {
        const queryParams = Object.values(params)
        const token = queryParams[0]
        if(token !== undefined){
          localStorage.setItem('token', token)
        }
        if (token) {
          this.route.navigate(['/signup']);
          this.userService.authToken().subscribe((res) => {
            console.log(res.jwt);
            localStorage.setItem('token', res.jwt)
            
          })
        }
      })
  }

  ngOnInit(): void {
      this.initializeAddAgentForm();
      // if (localStorage.getItem('token')) {
      //   this.route.navigate(['/signup']);
      // }
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
