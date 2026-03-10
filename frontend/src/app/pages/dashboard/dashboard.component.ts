import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../services/staff.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {
  staffCount: number = 0;
  loading: boolean = true;
  error: string = '';
  userName: string | null = null;

  constructor(
    private staffService: StaffService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.userName = user?.name || null;
    });
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.staffService.getStaff().subscribe({
      next: (response: any) => {
        const staffData = response?.data || response || [];
        this.staffCount = staffData.length || 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni az adatokat';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
