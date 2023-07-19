import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAgentComponent } from './add-agent.component';

const routes: Routes = [
  {
    path: '',
    component: AddAgentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAgentRoutingModule { }
