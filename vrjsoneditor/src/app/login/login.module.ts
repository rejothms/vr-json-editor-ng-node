import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginviewComponent } from './components/loginview/loginview.component';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoginviewComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule
  ]
})
export class LoginModule { }
