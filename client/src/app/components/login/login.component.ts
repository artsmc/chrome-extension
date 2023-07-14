import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isSuccess = false;
  public isErr = false;
  public submitted = false

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeLoginForm()
      
  }

  /**
   * @description: Initializing a feedback form using reactive forms.
   */

  private initializeLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])]
    });
  }

  // convenience getter for easy access to form fields

  get f() {
    console.log(this.loginForm.controls);
    
    return this.loginForm.controls;
  }

  public login(): void {
    console.log(this.loginForm);
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.userService.login(this.loginForm.value.email).subscribe((res: any) => {
      console.log(res);
      
    })
    // console.log(this.loginForm);
    // if(this.loginForm.value.email === 'test@gmail.com') {
    //   this.isSuccess = true;
    //   this.isErr = false;
    // } else {
    //   this.isSuccess = false;
    //   this.isErr = true
    // }
  }

}
