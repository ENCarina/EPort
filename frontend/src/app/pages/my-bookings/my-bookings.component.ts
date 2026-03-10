import { Component, OnInit } from '@angular/core';
import { BookingService, Booking } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: []
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading: boolean = true;
  error: string = '';
  isDoctor: boolean = false;
  isAdmin: boolean = false;
  selectedDoctorStaffId: number | null = null;
  selectedDoctorName: string = '';

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isDoctor = user?.roleId === 1;
      this.isAdmin = user?.roleId === 2;
    });

    this.route.queryParamMap.subscribe(params => {
      const doctorStaffIdParam = params.get('doctorStaffId');
      this.selectedDoctorStaffId = doctorStaffIdParam ? Number(doctorStaffIdParam) : null;
      this.selectedDoctorName = params.get('doctorName') || '';
      this.fetchBookings();
    });
  }

  fetchBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (response: any) => {
        console.log('Full bookings response:', response);
        console.log('Bookings data:', response.data);
        const bookingsData = response.data || response || [];
        console.log('Processed bookings:', bookingsData);
        this.bookings = this.getFilteredBookings(bookingsData);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni az időpontokat';
        console.error('Bookings error:', err);
        this.loading = false;
      }
    });
  }

  handleCancelBooking(id: number): void {
    if (!confirm('Biztosan lemondja ezt az időpontot?')) return;

    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.id !== id);
      },
      error: () => {
        this.error = 'Nem sikerült lemondani az időpontot';
      }
    });
  }

  formatDateTime(date: string, time: string): string {
    if (!date || !time) return '';
    // Convert 2026-03-10 to 2026.03.10.
    let formattedDate = date.substring(0, 10).replace(/[-]/g, '.');
    if (!formattedDate.endsWith('.')) {
      formattedDate += '.';
    }

    const parsedTime = new Date(time);
    const formattedTime = isNaN(parsedTime.getTime())
      ? time.substring(0, 5)
      : parsedTime.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });

    return `${formattedDate} ${formattedTime}`;
  }

  getPartnerName(booking: any): string {
    if (this.isAdmin) {
      return booking.patient?.name || 'Páciens';
    }

    if (this.isDoctor) {
      return booking.patient?.name || 'Páciens';
    }

    return booking.doctor?.user?.name || booking.staffName || 'Szakember';
  }

  getPartnerSubtitle(booking: any): string {
    if (this.isAdmin) {
      const doctorName = booking.doctor?.user?.name || 'Nincs orvos';
      return `Orvos: ${doctorName}`;
    }

    if (this.isDoctor) {
      return booking.patient?.email || '';
    }

    return booking.doctor?.specialty || 'Általános gyakorlat';
  }

  getPartnerLabel(): string {
    if (this.isAdmin) {
      return 'Páciens';
    }

    return this.isDoctor ? 'Páciens' : 'Szakember';
  }

  getPageTitle(): string {
    if (this.isAdmin) {
      if (this.selectedDoctorStaffId) {
        const doctorName = this.selectedDoctorName || 'Kiválasztott orvos';
        return `${doctorName} foglalt időpontjai`;
      }

      return 'Összes foglalt időpont';
    }

    return this.isDoctor ? 'Pácienseim időpontjai' : 'Időpontjaim';
  }

  getConsultationType(booking: any): string {
    return booking.type?.name || 'Konzultáció';
  }

  getPrice(booking: any): number | null {
    return booking.type?.price || null;
  }

  private getFilteredBookings(bookingsData: any[]): any[] {
    if (this.isAdmin && this.selectedDoctorStaffId) {
      return bookingsData.filter((booking: any) => booking.staffId === this.selectedDoctorStaffId);
    }

    return bookingsData;
  }
}
