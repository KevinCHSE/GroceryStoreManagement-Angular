import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login-component';
import { authGuard } from './Security/auth-guards';


export const routes: Routes = [
  {
    path:"",
    component:LoginComponent
  },
  {
    path:"Pulperia",
    loadChildren:()=>import('./Pulperia/Pulperia.routes'),
    canActivate:[authGuard]
  },
  {
    path: "**" ,
    component:LoginComponent
  },

];
