import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminSignupComponent } from './admin-signup/admin-signup.component';
import { AuthComponent } from './auth/auth.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
      {
        path: 'signin',

        component: SigninComponent,
      },
      {
        path: 'signup',

        component: SignupComponent,
      },
      {
        path: 'signup/admin',

        component: AdminSignupComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPwdComponent,
      },
      {
        path: 'forgot-password/reset/:token',

        component: ResetPwdComponent,
      },
      {
        path: '**',
        redirectTo: 'signin',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
