import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPasswordComponent } from './new-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewPasswordRoutingModule } from './new-password-routing.module';



@NgModule({
  declarations: [
    NewPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NewPasswordRoutingModule
  ],
  exports: [
    NewPasswordComponent
  ]
})
export class NewPasswordModule { }
