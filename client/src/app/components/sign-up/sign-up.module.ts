import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SignupRoutingModule } from './sign-up-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SignUpComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    SignupRoutingModule
  ],
  exports: [
    SignUpComponent
  ]
})
export class SignupModule { }
