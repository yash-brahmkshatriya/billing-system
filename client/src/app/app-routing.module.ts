import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { AllBillsComponent } from './components/billing/all-bills/all-bills.component';
import { CreateBillComponent } from './components/billing/create-bill/create-bill.component';
import { ShowBillComponent } from './components/billing/show-bill/show-bill.component';
import { PrintBillComponent } from './components/billing/print-bill/print-bill.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { HomeComponent } from'./components/home/home.component';
import { Page404Component } from './components/page404/page404.component';

import { UserapiService } from './services/userapi.service';
import { AuthGuardService,ForwardAuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'/home'},
  {path:'home',component:HomeComponent},
  {path:'login',component:UserLoginComponent,canActivate:[ForwardAuthGuardService]},
  {path:'register',component:UserRegisterComponent,canActivate:[ForwardAuthGuardService]},
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuardService]},
  {path:'profile',component:UserProfileComponent,canActivate:[AuthGuardService]},
  {path:'changePwd',component:ChangePasswordComponent,canActivate:[AuthGuardService]},
  {path:'bills/create',component:CreateBillComponent,canActivate:[AuthGuardService]},
  {path:'bills/show',component:AllBillsComponent,canActivate:[AuthGuardService]},
  {path:'bills/show/:id',component:ShowBillComponent,canActivate:[AuthGuardService]},
  {path:'bills/print/:id',component:PrintBillComponent,canActivate:[AuthGuardService]},
  {path:'**',component:Page404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
