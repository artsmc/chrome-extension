import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  public newPasswordForm!: FormGroup;
  public submitted = false;
  // public isSuccess = true;

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
    this.initializeNewPasswordForm()
    console.log({url: window.location});
  }

  /**
   * @description: Initializing a new password form using reactive forms.
   */

  private initializeNewPasswordForm(): void {
    this.newPasswordForm = this.formBuilder.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }


  // convenience getter for easy access to form fields

  get fNewPassword() {
    return this.newPasswordForm.controls;
  }

  public resetPassword(): void {
    console.log(this.newPasswordForm);
    // this.isSuccess = true
    
  }
}
