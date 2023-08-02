import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  public forgotPasswordForm!: FormGroup;
  public submitted = false;
  public isPasswordReset = false;

  constructor(
    private router : Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: Router
  ) {
     const user = this.userService.getUserValue();
     console.log('user', user);
     
        // const user = true
        // if (user) {
        //     // logged in so return true
        //     this.router.navigate(['/response']);
        // } 
  }

  ngOnInit(): void {
    this.initializeForgotPasswordForm()
    console.log({url: window.location});
  }

  /**
   * @description: Initializing a login form using reactive forms.
   */

  private initializeForgotPasswordForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])]
    });
  }


  // convenience getter for easy access to form fields

  get fForgotPassword() {
    return this.forgotPasswordForm.controls;
  }

  public forgotPassword(): void {
    console.log(this.forgotPasswordForm);
    // On Success
    this.isPasswordReset = true
    // this.router.navigate(['/reset-password']);
  }

}
