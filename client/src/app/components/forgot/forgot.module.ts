import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotComponent } from './forgot.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ForgotRoutingModule } from './forgot-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ForgotComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    ForgotRoutingModule
  ],
  exports: [
    ForgotComponent
  ]
})
export class ForgotModule { }
