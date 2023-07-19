import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAgentComponent } from './add-agent.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddAgentRoutingModule } from './add-agent-routing.module';



@NgModule({
  declarations: [
    AddAgentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddAgentRoutingModule
  ],
  exports: [
    AddAgentComponent
  ]
})
export class AddAgentModule { }
