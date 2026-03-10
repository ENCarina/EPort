import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { SlotService, Slot } from '../../services/slot.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: []
})
export class StaffDetailComponent implements OnInit {
  staff: any = null;
  slots: Slot[] = [];
  selectedSlot: Slot | null = null;
  notes: string = '';
  loading: boolean = true;
  error: string = '';
  bookingLoading: boolean = false;
  staffId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private staffService: StaffService,
    private slotService: SlotService,
    private bookingService: BookingService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.staff = navigation.extras.state['staff'];
    }
  }

  ngOnInit(): void {
    this.staffId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData(): void {
    console.log('Loading data for staff ID:', this.staffId);

    // Fetch staff if not already loaded
    if (!this.staff) {
      this.staffService.getStaffDetail(this.staffId).subscribe({
        next: (response: any) => {
          console.log('Staff detail response', response);
          this.staff = response.data || response || null;
        },
        error: (err) => {
          this.error = 'Nem sikerült betölteni a szakember adatait';
          console.error('Error loading staff:', err);
          this.loading = false;
        }
      });
    }

    // Always fetch slots
    this.slotService.getSlots(this.staffId).subscribe({
      next: (response: any) => {
        console.log('Slots response', response);
        this.slots = response.data || response || [];
        console.log('Slots array length:', this.slots.length);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni az időpontokat';
        console.error('Error loading slots:', err);
        this.loading = false;
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
        this.router.navigate(['/my-bookings']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Sikertelen időpontfoglalás';
        this.bookingLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/staff']);
  }

  getStaffName(): string {
    return this.staff?.User?.name || this.staff?.user?.name || this.staff?.name || 'Ismeretlen orvos';
  }

  getSpecialty(): string {
    return this.staff?.specialty || 'Általános gyakorlat';
  }

  getBio(): string {
    return this.staff?.bio || 'Nincs elérhető információ';
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
