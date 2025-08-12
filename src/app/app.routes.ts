import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { PetstoreComponent } from './Petstore/Petstore.component';
import { AddpetComponent } from './addpet/addpet.component';
import { PetdetailsComponent } from './petdetails/petdetails.component';
import { AuthGuardService } from './auth-guard/auth-guard.service';

export const routes: Routes = [
  { path: '', component: PetstoreComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'add-pet',
    component: AddpetComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'pet/:id', component: PetdetailsComponent },
  { path: '**', redirectTo: '' },
];
