import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StaffListingComponent } from './pages/staff-listing/staff-listing.component';
import { StaffDetailComponent } from './pages/staff-detail/staff-detail.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'staff', 
    component: StaffListingComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'staff/:id', 
    component: StaffDetailComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'booking', 
    component: BookingPageComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'my-bookings', 
    component: MyBookingsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
