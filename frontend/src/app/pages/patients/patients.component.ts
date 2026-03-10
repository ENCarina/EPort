import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  patientSearchTerm: string = '';
  filteredPatients: any[] = [];
  bookings: any[] = [];
  expandedPatientId: number | null = null;
  loading: boolean = true;
  error: string = '';
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isAdmin = Number(user?.roleId) === 2;
      if (!this.isAdmin) {
        this.error = 'A páciensek oldal csak admin számára elérhető.';
        this.loading = false;
      }
    });

    if (this.isAdmin) {
      this.loadPatientsAndBookings();
    }
  }

  updatePatientFilter(): void {
    const query = this.patientSearchTerm.trim().toLowerCase();
    this.filteredPatients = this.patients.filter((patient) => {
      if (!query) return true;

      return (
        (patient.name || '').toLowerCase().includes(query) ||
        (patient.email || '').toLowerCase().includes(query) ||
        (patient.taj || '').toLowerCase().includes(query)
      );
    });
  }

  togglePatient(patientId: number): void {
    this.expandedPatientId = this.expandedPatientId === patientId ? null : patientId;
  }

  getBookingsForPatient(patientId: number): any[] {
    return this.bookings
      .filter((booking) => Number(booking.patientId) === Number(patientId))
      .sort((a, b) => {
        const left = `${a.slot?.date || ''} ${a.slot?.startTime || ''}`;
        const right = `${b.slot?.date || ''} ${b.slot?.startTime || ''}`;
        return right.localeCompare(left);
      });
  }

  getBookingCount(patientId: number): number {
    return this.getBookingsForPatient(patientId).length;
  }

  startBookingForPatient(patient: any): void {
    this.router.navigate(['/booking'], {
      queryParams: {
        patientId: patient.id,
        patientName: patient.name || '',
        patientEmail: patient.email || '',
        patientTaj: patient.taj || ''
      }
    });
  }

  formatDateTime(booking: any): string {
    const date = booking?.slot?.date;
    const time = booking?.slot?.startTime;

    if (!date || !time) {
      return booking?.startTime || '';
    }

    const formattedDate = date.substring(0, 10).replace(/[-]/g, '.');
    const formattedTime = time.substring(0, 5);
    return `${formattedDate}. ${formattedTime}`;
  }

  private loadPatientsAndBookings(): void {
    this.loading = true;

    this.userService.getUsers().subscribe({
      next: (usersResponse: any) => {
        const users = usersResponse?.data || usersResponse || [];
        this.patients = users
          .filter((user: any) => Number(user.roleId) === 0)
          .sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '', 'hu'));
        this.updatePatientFilter();

        this.bookingService.getBookings().subscribe({
          next: (bookingsResponse: any) => {
            this.bookings = bookingsResponse?.data || bookingsResponse || [];
            this.loading = false;
          },
          error: () => {
            this.error = 'Nem sikerült betölteni a páciens foglalásokat.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Nem sikerült betölteni a pácienseket.';
        this.loading = false;
      }
    });
  }
}
