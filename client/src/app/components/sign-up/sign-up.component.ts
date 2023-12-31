import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signupForm!: FormGroup;
  public submitted = false;
  public isLoginSection = true;
  public errors: string[]|null = null;
  constructor(
    private router : Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: Router
  ) {
     const user = this.userService.getUserValue();
  }

  ngOnInit(): void {
    this.errors = null;
    this.initializesSignupForm();
  }

  /**
   * @description: Initializing a signup form using reactive forms.
   */

  private initializesSignupForm(): void {
    this.signupForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.required],
      fullName: [null, Validators.required]
    });
  }

  get fSignup() {
    return this.signupForm.controls;
  }

  public signup(): void {
    this.errors = null;
    console.log(this.signupForm);
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.userService.createUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.fullName).subscribe((user: any) => {
      const loginSection = document.getElementById('ex1-tab-1')
      this.router.navigate(['/login']);
    }, (err) => {
      this.errors = [];
      err.data.forEach((error: any) => {
        if(this.errors) {
          this.errors.push(error.message);
        }
      });
    });
  }

}
