import { Component, OnInit } from '@angular/core';
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
  selectedSlot: Slot | null = null;
  notes: string = '';
  loading: boolean = true;
  error: string = '';
  bookingLoading: boolean = false;

  constructor(
    private staffService: StaffService,
    private slotService: SlotService,
    private bookingService: BookingService
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
        this.error = `Nem sikerült betölteni a szakembereket: ${err.message}`;
        console.error('Staff error:', err);
        this.loading = false;
      }
    });
  }

  handleStaffSelect(staffMember: any): void {
    this.selectedStaff = staffMember;
    this.selectedSlot = null;
    
    this.slotService.getSlots(staffMember.id).subscribe({
      next: (response: any) => {
        console.log('Slots response:', response);
        this.slots = response.data || response || [];
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni az időpontokat';
        console.error('Slots error:', err);
      }
    });
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
        this.selectedStaff = null;
        this.selectedSlot = null;
        this.notes = '';
        this.bookingLoading = false;
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
    return time.substring(0, 5);
  }

  formatSlotDateTime(slot: Slot): string {
    if (!slot.date) return '';
    
    // Handle date format - convert 2026-03-10 to 2026.03.10.
    let formattedDate = slot.date.replace(/[-]/g, '.');
    if (!formattedDate.endsWith('.')) {
      formattedDate += '.';
    }
    
    // Format time - get HH:MM from startTime
    let formattedTime = '';
    if (slot.startTime) {
      formattedTime = slot.startTime.substring(0, 5);
    }
    
    return `${formattedDate} ${formattedTime}`.trim();
  }
}
