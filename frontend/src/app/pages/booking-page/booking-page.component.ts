import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { SlotService, Slot } from '../../services/slot.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: []
})
export class BookingPageComponent implements OnInit {
  staff: any[] = [];
  selectedStaff: any = null;
  slots: Slot[] = [];
  availableDates: string[] = [];
  selectedDate: string | null = null;
  selectedSlot: Slot | null = null;
  notes: string = '';
  loading: boolean = true;
  error: string = '';
  bookingLoading: boolean = false;

  constructor(
    private staffService: StaffService,
    private slotService: SlotService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchInitialData();
  }

  fetchInitialData(): void {
    this.staffService.getStaff().subscribe({
      next: (response: any) => {
        console.log('Staff response:', response);
        const staffData = response.data || response || [];
        console.log('Staff data:', staffData);
        if (staffData.length > 0) {
          this.staff = staffData;
          this.error = '';
        } else {
          this.error = 'Nincsenek elérhető szakemberek';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.status === 0
          ? 'Nem sikerült kapcsolódni a backendhez (localhost:8000). Ellenőrizd, hogy fut-e az API szerver.'
          : `Nem sikerült betölteni a szakembereket: ${err.message}`;
        console.error('Staff error:', err);
        this.loading = false;
      }
    });
  }

  handleStaffSelect(staffMember: any): void {
    this.selectedStaff = staffMember;
    this.selectedDate = null;
    this.selectedSlot = null;
    this.availableDates = [];
    this.error = '';
    
    this.slotService.getSlots(staffMember.id).subscribe({
      next: (response: any) => {
        console.log('Slots response:', response);
        const slots = response.data || response || [];
        this.slots = slots.filter((slot: Slot) => this.isSelectableDate(slot.date));
        this.availableDates = [...new Set(this.slots.map((slot: Slot) => slot.date))].sort();

        if (this.availableDates.length === 0) {
          this.error = 'Nincsenek elérhető időpontok a kiválasztott időszakban.';
        }
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni az időpontokat';
        console.error('Slots error:', err);
      }
    });
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.selectedSlot = null;
  }

  selectSlot(slot: Slot): void {
    this.selectedSlot = slot;
  }

  handleBooking(): void {
    if (!this.selectedSlot) {
      this.error = 'Kérjük válasszon időpontot';
      return;
    }

    this.bookingLoading = true;
    this.bookingService.createBooking({
      slotId: this.selectedSlot.id,
      notes: this.notes
    }).subscribe({
      next: () => {
        alert('Időpont sikeresen lefoglalva!');
        this.bookingLoading = false;
        this.router.navigate(['/my-bookings']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Sikertelen időpontfoglalás';
        this.bookingLoading = false;
      }
    });
  }

  getStaffName(member: any): string {
    return member.User?.name || member.user?.name || member.name || 'Ismeretlen';
  }

  getSpecialty(member: any): string {
    return member.specialty || 'Általános gyakorlat';
  }

  formatTimeOnly(time: string): string {
    if (!time) return '';

    const parsedTime = new Date(time);
    if (!isNaN(parsedTime.getTime())) {
      return parsedTime.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    }

    return time.substring(0, 5);
  }

  formatSlotDateTime(slot: Slot): string {
    if (!slot.date) return '';

    const [, month, day] = slot.date.substring(0, 10).split('-');
    const formattedDate = `${month}.${day}.`;
    const formattedTime = this.formatTimeOnly(slot.startTime || '');

    return `${formattedDate} ${formattedTime}`.trim();
  }

  formatTimeRange(slot: Slot): string {
    const start = this.formatTimeOnly(slot.startTime || '');
    const end = this.formatTimeOnly(slot.endTime || '');
    return `${start} - ${end}`;
  }

  getSlotsForSelectedDate(): Slot[] {
    if (!this.selectedDate) return [];
    return this.slots
      .filter(slot => slot.date === this.selectedDate)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }

  formatDateLabel(date: string): string {
    const dateObj = new Date(`${date}T00:00:00`);
    const day = dateObj.getDate();
    const monthNames = [
      'január', 'február', 'március', 'április', 'május', 'június',
      'július', 'augusztus', 'szeptember', 'október', 'november', 'december'
    ];
    const weekdays = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];

    return `${monthNames[dateObj.getMonth()]} ${day}. (${weekdays[dateObj.getDay()]})`;
  }

  private isSelectableDate(date: string): boolean {
    const d = new Date(`${date}T00:00:00`);
    const start = new Date('2026-03-10T00:00:00');
    const end = new Date('2026-06-30T23:59:59');
    const day = d.getDay();

    const inRange = d >= start && d <= end;
    const mondayToSaturday = day >= 1 && day <= 6;

    return inRange && mondayToSaturday;
  }

  getDisplayedYear(): string {
    if (this.selectedDate) return this.selectedDate.substring(0, 4);
    if (!this.availableDates.length) return '2026';
    return this.availableDates[0].substring(0, 4);
  }
}
