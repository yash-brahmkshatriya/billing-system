import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DatePipe } from '@angular/common';

import { FlashMessagesModule } from 'angular2-flash-messages';

// Components
import { AppComponent } from './app.component';
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component'
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { CreateBillComponent } from './components/billing/create-bill/create-bill.component';
import { AllBillsComponent } from './components/billing/all-bills/all-bills.component';
import { ShowBillComponent } from './components/billing/show-bill/show-bill.component';
import { PrintBillComponent } from './components/billing/print-bill/print-bill.component';

// Services
import { UserapiService } from './services/userapi.service';
import { AuthGuardService,ForwardAuthGuardService } from './services/auth-guard.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { JwtModule } from '@auth0/angular-jwt';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { HomeComponent } from './components/home/home.component';
import { Page404Component } from './components/page404/page404.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserRegisterComponent,
    DashboardComponent,
    NavbarComponent,
    UserProfileComponent,
    CreateBillComponent,
    AllBillsComponent,
    ShowBillComponent,
    PrintBillComponent,
    ChangePasswordComponent,
    HomeComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter : () => {return localStorage.getItem('auth-token');},
        allowedDomains : ["http://localhost:8000"]
      }
    })
  ],
  providers: [
    UserapiService,
    AuthGuardService,
    ForwardAuthGuardService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass :TokenInterceptorService,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
