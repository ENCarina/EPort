import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StaffService, Staff } from '../../services/staff.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-staff-listing',
  templateUrl: './staff-listing.component.html',
  styleUrls: ['./staff-listing.component.css']
})
export class StaffListingComponent implements OnInit {
  private readonly femaleNames = [
    'tunde',
    'tünde',
    'dora',
    'dóra',
    'reka',
    'réka',
    'eszter',
    'anna',
    'zsuzsa',
    'kata',
    'julia',
    'júlia'
  ];

  staff: any[] = [];
  loading: boolean = true;
  error: string = '';
  canBookAppointments: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private staffService: StaffService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.canBookAppointments = user?.roleId === 0;
      this.isAdmin = user?.roleId === 2;
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

  viewBookedAppointments(member: any): void {
    this.router.navigate(['/my-bookings'], {
      queryParams: {
        doctorStaffId: member.id,
        doctorName: this.getStaffName(member)
      }
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

  private getGenderImage(member: any): string {
    const gender = (member.gender || member.User?.gender || member.user?.gender || '').toString().toLowerCase();
    if (gender.startsWith('f')) {
      return 'assets/female_doctor.webp';
    }

    const name = this.getStaffName(member).toLowerCase();
    const isFemaleByName = this.femaleNames.some((token) => name.includes(token));
    return isFemaleByName ? 'assets/female_doctor.webp' : 'assets/male_doctor.webp';
  }

  getImageUrl(member: any): string {
    const imageUrl =
      member.imageUrl ||
      member.image ||
      member.photo ||
      member.avatar ||
      member.profileImage ||
      member.User?.imageUrl ||
      member.user?.imageUrl;

    if (!imageUrl || imageUrl.includes('example.com')) {
      return this.getGenderImage(member);
    }

    return imageUrl;
  }

  onImageError(event: Event, member: any): void {
    const target = event.target as HTMLImageElement;
    target.src = this.getGenderImage(member);
  }
}
