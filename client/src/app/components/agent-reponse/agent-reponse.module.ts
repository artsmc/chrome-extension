import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentResponseComponent } from './agent-response.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentResponseRoutingModule } from './agent-response-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    AgentResponseComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AgentResponseRoutingModule
  ],
  exports: [
    AgentResponseComponent
  ]
})
export class AgentReponseModule { }
