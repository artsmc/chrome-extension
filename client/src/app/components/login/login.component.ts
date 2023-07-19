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
  public submitted = false;
  public isLoginSection = true;

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
    return this.loginForm.controls;
  }

  public login(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.userService.login(this.loginForm.value.email).subscribe((res: any) => {
      console.log(res);
      this.isLoginSection = false
    })
  }

}
