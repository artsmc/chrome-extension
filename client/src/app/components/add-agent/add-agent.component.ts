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
    this.router.queryParams
      .subscribe(params => {
        const queryParams = Object.values(params)
        const token = queryParams[0]
        const user = this.userService.getUserValue();
        console.log({user});
        // const user = true
        // if (user) {
        //     // logged in so return true
        //     this.route.navigate(['/response']);
        // } 
        if(token !== undefined){
          localStorage.setItem('token', token)
        }
        if (token) {
          this.userService.authToken().subscribe((res) => {
            console.log(res.jwt);
            localStorage.setItem('token', res.jwt)
            this.route.navigate(['/signup']);
            this.userService.setUserValue(res)
            
          }, (error) => {
            this.route.navigate(['/login']);
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

  // convenience getter for easy access to form fields

  get f() {
    console.log(this.addAgentForm.controls);
    
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
  }

}
