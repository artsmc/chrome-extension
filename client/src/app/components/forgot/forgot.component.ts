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
  public loginForm!: FormGroup;
  public signupForm!: FormGroup;
  public submitted = false;
  public isLoginSection = true;

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
    this.initializeLoginForm()
    this.initializesSignupForm()
    console.log({url: window.location});
  }

  /**
   * @description: Initializing a login form using reactive forms.
   */

  private initializeLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.required],
    });
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

  // convenience getter for easy access to form fields

  get fLogin() {
    return this.loginForm.controls;
  }

  get fSignup() {
    return this.signupForm.controls;
  }


  public login(): void {
    console.log(this.loginForm);
    
    // this.route.navigate(['/signup']);
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.userService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((res: any) => {
      console.log(res);
      localStorage.setItem('token', res?.token)
      // this.isLoginSection = false
      this.router.navigate(['/signup']);
    })
  }

  public signup(): void {
    console.log(this.signupForm);
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.userService.createUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.fullName).subscribe((user: any) => {
      console.log('userrrs', user);
      const loginSection = document.getElementById('ex1-tab-1')
      
    })
  }

}
