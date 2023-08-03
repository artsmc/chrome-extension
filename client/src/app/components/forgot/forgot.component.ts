import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { response } from 'express';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  public forgotPasswordForm!: FormGroup;
  public verifyPasswordForm!: FormGroup;
  public submitted = false;
  public isPasswordReset = false;
  public email = '';
  public errorMessage:null| string = null;
  constructor(
    private router : Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: Router
  ) {
     const user = this.userService.getUserValue();
  }

  ngOnInit(): void {
    this.initializeForgotPasswordForm();
  }

  /**
   * @description: Initializing a login form using reactive forms.
   */

  private initializeForgotPasswordForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])]
    });
  }
  private initializeVerifyPasswordForm(): void {
    this.verifyPasswordForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      resetNumber: [null, Validators.compose([Validators.required, Validators.min(6)])]
    });
  }


  // convenience getter for easy access to form fields

  get fForgotPassword() {
    return this.forgotPasswordForm.controls;
  }
  get fverifyPassword() {
    return this.verifyPasswordForm.controls;
  }

  public forgotPassword(): void {
    this.email = this.forgotPasswordForm.value.email;
    this.userService.forgotPassword(this.email, window.location.href).subscribe(
      (response: any) => {
        this.isPasswordReset = true;
        this.initializeVerifyPasswordForm();
        this.verifyPasswordForm.controls['email'].setValue(this.email);
        this.errorMessage = null;
      }, fail => {
        this.errorMessage = fail;
      }
    );
  }
  public verifyCode(): void {
    this.userService.verifyPassword(this.verifyPasswordForm.value).subscribe(
      response => {
        localStorage.setItem('token', response?.token)
        this.route.navigate(['/reset-password', { token: response.token }]);
        this.errorMessage = null;
      }, fail => {
        this.errorMessage = fail;
      });

  } 
  

}
