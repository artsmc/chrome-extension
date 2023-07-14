import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAgentComponent } from './components/add-agent/add-agent.component';

const routes: Routes = [
  // {
  //   path: 'signup',
  //   component: AddAgentModule,
  //   // canActivate: [AuthGuard],
  // },
  {
    path: 'signup',
    // canActivate: [AuthGuard],
    loadChildren: () =>
    import('./components/add-agent/add-agent.module').then((m) => m.AddAgentModule),
  },
  {
    path: 'login',
    // canActivate: [AuthGuard],
    loadChildren: () =>
    import('./components/login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'response',
    // canActivate: [AuthGuard],
    loadChildren: () =>
    import('./components/agent-reponse/agent-reponse.module').then((m) => m.AgentReponseModule)
  },
  // { path: '', component: AddAgentComponent },
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: AddAgentComponent }
  // { path: '', redirectTo: 'signup' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
