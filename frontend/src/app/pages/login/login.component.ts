import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StaffService } from '../../services/staff.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;
  showDoctorLogins: boolean = false;
  doctorAccounts: Array<{ name: string; email: string }> = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.loadDoctorAccounts();
  }

  handleSubmit(): void {
    this.error = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Sikertelen bejelentkezés';
        this.loading = false;
      }
    });
  }

  handleDemoLogin(): void {
    this.error = '';
    this.loading = true;

    this.authService.login('admin@ep.com', 'joyEtna').subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Demo belépés sikertelen';
        this.loading = false;
      }
    });
  }

  toggleDoctorLogins(): void {
    this.showDoctorLogins = !this.showDoctorLogins;
  }

  handleDoctorLogin(email: string): void {
    this.error = '';
    this.loading = true;

    this.authService.login(email, 'doctor123').subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Orvos belépés sikertelen';
        this.loading = false;
      }
    });
  }

  private loadDoctorAccounts(): void {
    this.staffService.getStaff().subscribe({
      next: (response: any) => {
        const staffData = response?.data || response || [];
        this.doctorAccounts = staffData
          .filter((member: any) => member?.user?.roleId === 1)
          .map((member: any) => ({
            name: member?.user?.name || 'Orvos',
            email: member?.user?.email || ''
          }))
          .filter((doctor: { name: string; email: string }) => !!doctor.email);
      },
      error: () => {
        this.doctorAccounts = [];
      }
    });
  }
}
