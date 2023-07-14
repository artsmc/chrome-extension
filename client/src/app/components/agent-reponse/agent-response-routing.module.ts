import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentResponseComponent } from './agent-response.component';

const routes: Routes = [
  {
    path: '',
    component: AgentResponseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentResponseRoutingModule { }
