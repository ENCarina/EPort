import { Component, OnInit } from '@angular/core';
import { BookingService, Booking } from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: []
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (response: any) => {
        console.log('Full bookings response:', response);
        console.log('Bookings data:', response.data);
        const bookingsData = response.data || response || [];
        console.log('Processed bookings:', bookingsData);
        this.bookings = bookingsData;
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

  getStaffName(booking: any): string {
    return booking.doctor?.user?.name || booking.staffName || 'Szakember';
  }

  getSpecialty(booking: any): string {
    return booking.doctor?.specialty || 'Általános gyakorlat';
  }

  getConsultationType(booking: any): string {
    return booking.type?.name || 'Konzultáció';
  }

  getPrice(booking: any): number | null {
    return booking.type?.price || null;
  }
}
