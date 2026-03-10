import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StaffService, Staff } from '../../services/staff.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-staff-listing',
  templateUrl: './staff-listing.component.html',
  styleUrls: []
})
export class StaffListingComponent implements OnInit {
  staff: any[] = [];
  loading: boolean = true;
  error: string = '';
  canBookAppointments: boolean = false;

  constructor(
    private staffService: StaffService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.canBookAppointments = user?.roleId === 0;
    });

    this.fetchStaff();
  }

  fetchStaff(): void {
    this.staffService.getStaff().subscribe({
      next: (response: any) => {
        console.log('Staff API response:', response);
        this.staff = response.data || response || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni a szakemberek listáját';
        console.error('Staff API error:', err);
        this.loading = false;
      }
    });
  }

  startBooking(member: any): void {
    this.router.navigate(['/booking'], {
      queryParams: { staffId: member.id }
    });
  }

  getStaffName(member: any): string {
    return member.User?.name || member.user?.name || member.name || 'Ismeretlen orvos';
  }

  getSpecialty(member: any): string {
    return member.specialty || 'Általános gyakorlat';
  }

  getBio(member: any): string {
    return member.bio || 'Nincs elérhető információ';
  }
}
