import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'signup',
    // canActivate: [AuthGuard],
    loadChildren: () =>
    import('./components/sign-up/sign-up.module').then((m) => m.SignupModule)
  },
  {
    path: 'reset-password',
    canActivate: [AuthGuard],
    loadChildren: () => 
    import('./components/new-password/new-password.module').then((m) => m.NewPasswordModule)
  },
  {
    path: 'sign-up',
    // canActivate: [AuthGuard],
    loadChildren: () =>
    import('./components/sign-up/sign-up.module').then((m) => m.SignupModule)
  },
  {
    path: 'forgot',
    // canActivate: [AuthGuard],
    loadChildren: () =>
    import('./components/forgot/forgot.module').then((m) => m.ForgotModule)
  },
  {
    path: 'login',
    // canActivate: [AuthGuard],
    loadChildren: () =>
    import('./components/login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'response',
    canActivate: [AuthGuard],
    loadChildren: () =>
    import('./components/agent-reponse/agent-reponse.module').then((m) => m.AgentReponseModule)
  },
  // { path: '', component: AddAgentComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
  // { path: 'signup', component: AddAgentComponent }
  // { path: '', redirectTo: 'signup' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
