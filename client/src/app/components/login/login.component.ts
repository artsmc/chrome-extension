import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public submitted = false;
  public isLoginSection = true;
  public isErr = false;

  constructor(
    private router : Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: Router
  ) {
     const user = this.userService.getUserValue();
  }

  ngOnInit(): void {
    this.initializeLoginForm();
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
  // convenience getter for easy access to form fields

  get fLogin() {
    return this.loginForm.controls;
  }


  public login(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.userService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((res: any) => {
      console.log(res);
      localStorage.setItem('token', res?.token)
      // this.isLoginSection = false
      this.router.navigate(['/response']);
    }, (err)=> {
      this.isErr = true
    })
  }

}
