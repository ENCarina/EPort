import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { SlotService, Slot } from '../../services/slot.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {
  private readonly periodSize = 14;
  private readonly daySlotsPageSize = 5;

  staff: any[] = [];
  selectedStaff: any = null;
  selectedConsultation: any = null;
  slots: Slot[] = [];
  availableDates: string[] = [];
  dateWindowStartIndex: number = 0;
  selectedDate: string | null = null;
  selectedSlot: Slot | null = null;
  currentWeekStart: Date = this.getWeekStart(new Date());
  notes: string = '';
  loading: boolean = true;
  error: string = '';
  bookingLoading: boolean = false;
  preselectedStaffId: number | null = null;
  preselectedConsultationId: number | null = null;
  autoSelectStaffForConsultation: boolean = false;
  staffSelectionLocked: boolean = false;
  canBookAppointments: boolean = false;
  canCreatePatientBooking: boolean = false;
  patientName: string = '';
  patientEmail: string = '';
  patientTaj: string = '';
  daySlotStartIndexMap: { [date: string]: number } = {};
  actionFeedbackVisible: boolean = false;
  actionFeedbackType: 'success' | 'error' = 'success';
  actionFeedbackMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private staffService: StaffService,
    private slotService: SlotService,
    private bookingService: BookingService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      const roleId = Number(user?.roleId);
      this.canBookAppointments = roleId === 0;
      this.canCreatePatientBooking = roleId === 2 || roleId === 1;
    });

    const staffIdParam = this.route.snapshot.queryParamMap.get('staffId');
    const consultationIdParam = this.route.snapshot.queryParamMap.get('consultationId');
    const autoStaffParam = this.route.snapshot.queryParamMap.get('autoStaff');
    const lockStaffParam = this.route.snapshot.queryParamMap.get('lockStaff');
    const patientNameParam = this.route.snapshot.queryParamMap.get('patientName');
    const patientEmailParam = this.route.snapshot.queryParamMap.get('patientEmail');
    const patientTajParam = this.route.snapshot.queryParamMap.get('patientTaj');
    this.preselectedStaffId = staffIdParam ? Number(staffIdParam) : null;
    this.preselectedConsultationId = consultationIdParam ? Number(consultationIdParam) : null;
    this.autoSelectStaffForConsultation = autoStaffParam === '1';
    this.staffSelectionLocked = lockStaffParam === '1';

    if (patientNameParam) this.patientName = patientNameParam;
    if (patientEmailParam) this.patientEmail = patientEmailParam;
    if (patientTajParam) this.patientTaj = patientTajParam;

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

          if (this.preselectedConsultationId && this.autoSelectStaffForConsultation) {
            this.initQuickBookingFlow(this.preselectedConsultationId);
          } else if (this.preselectedStaffId) {
            const matchingStaff = this.staff.find((member: any) => member.id === this.preselectedStaffId);
            if (matchingStaff) {
              this.handleStaffSelect(matchingStaff);
            }
          }
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
    if (this.staffSelectionLocked && this.selectedStaff && this.selectedStaff.id !== staffMember.id) {
      return;
    }

    this.selectedStaff = staffMember;
    this.selectedConsultation = null;
    this.selectedDate = null;
    this.selectedSlot = null;
    this.slots = [];
    this.availableDates = [];
    this.dateWindowStartIndex = 0;
    this.daySlotStartIndexMap = {};
    this.error = '';

    const services = this.getServicesForSelectedStaff();
    if (services.length === 0) {
      this.error = 'Ehhez az orvoshoz még nincs szolgáltatás hozzárendelve.';
    }
  }

  handleConsultationSelect(consultation: any): void {
    this.selectedConsultation = consultation;
    this.selectedDate = null;
    this.selectedSlot = null;
    this.availableDates = [];
    this.dateWindowStartIndex = 0;
    this.daySlotStartIndexMap = {};
    this.error = '';

    this.loadSlotsForSelection(this.selectedStaff.id, consultation.id);
  }

  isQuickBookingMode(): boolean {
    return !!(this.preselectedConsultationId && this.autoSelectStaffForConsultation);
  }

  private initQuickBookingFlow(consultationId: number): void {
    const candidateDoctors = this.staff.filter((member: any) =>
      (member?.services || []).some((service: any) => Number(service.id) === consultationId)
    );

    if (candidateDoctors.length === 0) {
      this.error = 'Ehhez a szolgáltatáshoz jelenleg nincs elérhető orvos.';
      return;
    }

    this.slotService.getSlots(undefined, consultationId).subscribe({
      next: (response: any) => {
        const allSlots = (response.data || response || [])
          .filter((slot: Slot) => this.isSelectableDate(slot.date));

        const firstAvailableSlot = allSlots[0];
        const selectedDoctor = firstAvailableSlot
          ? this.staff.find((member: any) => member.id === firstAvailableSlot.staffId)
          : candidateDoctors[0];

        this.selectedStaff = selectedDoctor;
        this.selectedConsultation = (selectedDoctor?.services || []).find(
          (service: any) => Number(service.id) === consultationId
        ) || { id: consultationId };
        this.selectedDate = null;
        this.selectedSlot = null;
        this.daySlotStartIndexMap = {};
        this.error = '';

        this.loadSlotsForSelection(selectedDoctor.id, consultationId);
      },
      error: () => {
        this.error = 'Nem sikerült betölteni az automatikus foglalási adatokat.';
      }
    });
  }

  private loadSlotsForSelection(staffId: number, consultationId: number): void {
    this.slotService.getSlots(staffId, consultationId).subscribe({
      next: (response: any) => {
        console.log('Slots response:', response);
        const slots = response.data || response || [];
        this.slots = slots.filter((slot: Slot) => this.isSelectableDate(slot.date));
        this.availableDates = [...new Set(this.slots.map((slot: Slot) => slot.date))].sort();
        this.dateWindowStartIndex = this.getDefaultWindowStartIndex();

        if (this.availableDates.length > 0) {
          this.currentWeekStart = this.getWeekStart(this.availableDates[0]);
        }

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

  getServicesForSelectedStaff(): any[] {
    if (!this.selectedStaff?.services) return [];
    return this.selectedStaff.services;
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.selectedSlot = null;
  }

  getWeekDays(): string[] {
    const days: string[] = [];
    const start = new Date(this.currentWeekStart);

    for (let i = 0; i < 7; i += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(this.toDateKey(day));
    }

    return days;
  }

  goToPreviousWeek(): void {
    const prev = new Date(this.currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    this.currentWeekStart = prev;
    this.ensureSelectedSlotVisible();
  }

  goToNextWeek(): void {
    const next = new Date(this.currentWeekStart);
    next.setDate(next.getDate() + 7);
    this.currentWeekStart = next;
    this.ensureSelectedSlotVisible();
  }

  goToCurrentWeek(): void {
    this.currentWeekStart = this.getWeekStart(new Date());
    this.ensureSelectedSlotVisible();
  }

  getWeekLabel(): string {
    const weekDays = this.getWeekDays();
    if (!weekDays.length) return '';

    const first = this.formatDateLabelShort(weekDays[0]);
    const last = this.formatDateLabelShort(weekDays[6]);
    return `${first} - ${last}`;
  }

  getVisibleDates(): string[] {
    return this.availableDates.slice(this.dateWindowStartIndex, this.dateWindowStartIndex + this.periodSize);
  }

  canGoToPreviousPeriod(): boolean {
    return this.dateWindowStartIndex > 0;
  }

  canGoToNextPeriod(): boolean {
    return this.dateWindowStartIndex + this.periodSize < this.availableDates.length;
  }

  goToPreviousPeriod(): void {
    if (!this.canGoToPreviousPeriod()) return;
    this.dateWindowStartIndex = Math.max(0, this.dateWindowStartIndex - this.periodSize);
    this.ensureSelectedDateVisible();
  }

  goToNextPeriod(): void {
    if (!this.canGoToNextPeriod()) return;
    this.dateWindowStartIndex = Math.min(
      this.availableDates.length - 1,
      this.dateWindowStartIndex + this.periodSize
    );
    this.ensureSelectedDateVisible();
  }

  getCurrentPeriodLabel(): string {
    const visibleDates = this.getVisibleDates();
    if (!visibleDates.length) return '';

    const first = this.formatDateLabel(visibleDates[0]);
    const last = this.formatDateLabel(visibleDates[visibleDates.length - 1]);
    return `${first} - ${last}`;
  }

  selectSlot(slot: Slot): void {
    this.selectedSlot = slot;
    this.ensureSlotVisibleInDayPage(slot);
  }

  handleBooking(): void {
    if (!this.canBookAppointments && !this.canCreatePatientBooking) {
      this.error = 'Ehhez nincs jogosultság. Csak páciens, orvos vagy vezető asszisztens hozhat létre foglalást.';
      return;
    }

    if (!this.selectedSlot) {
      this.error = 'Kérjük válasszon időpontot';
      return;
    }

    if (!this.selectedConsultation) {
      this.error = 'Kérjük válasszon szolgáltatást';
      return;
    }

    if (this.canCreatePatientBooking && (!this.patientName || !this.patientEmail || !this.patientTaj)) {
      this.error = 'Új páciens felvételéhez adja meg a nevet, email címet és TAJ számot.';
      return;
    }

    this.bookingLoading = true;
    const payload: any = {
      slotId: this.selectedSlot.id,
      consultationId: this.selectedConsultation.id,
      notes: this.notes
    };

    if (this.canCreatePatientBooking) {
      payload.patientName = this.patientName;
      payload.patientEmail = this.patientEmail;
      payload.patientTaj = this.patientTaj;
    }

    this.bookingService.createBooking(payload).subscribe({
      next: () => {
        this.showActionFeedback(
          'success',
          this.canCreatePatientBooking
            ? 'Új páciens felvéve és az időpont sikeresen lefoglalva!'
            : 'Időpont sikeresen lefoglalva!'
        );
        this.bookingLoading = false;
        setTimeout(() => this.router.navigate(['/my-bookings']), 1300);
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

  getSlotsForDate(date: string): Slot[] {
    return this.slots
      .filter(slot => slot.date === date)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(value || 0);
  }

  getVisibleSlotsForDate(date: string): Slot[] {
    const allSlots = this.getSlotsForDate(date);
    const start = this.daySlotStartIndexMap[date] || 0;
    return allSlots.slice(start, start + this.daySlotsPageSize);
  }

  canScrollDayEarlier(date: string): boolean {
    return (this.daySlotStartIndexMap[date] || 0) > 0;
  }

  canScrollDayLater(date: string): boolean {
    const allSlots = this.getSlotsForDate(date);
    const start = this.daySlotStartIndexMap[date] || 0;
    return start + this.daySlotsPageSize < allSlots.length;
  }

  scrollDayEarlier(date: string): void {
    const currentStart = this.daySlotStartIndexMap[date] || 0;
    this.daySlotStartIndexMap[date] = Math.max(0, currentStart - this.daySlotsPageSize);
  }

  scrollDayLater(date: string): void {
    const allSlots = this.getSlotsForDate(date);
    const currentStart = this.daySlotStartIndexMap[date] || 0;
    const maxStart = Math.max(0, allSlots.length - this.daySlotsPageSize);
    this.daySlotStartIndexMap[date] = Math.min(maxStart, currentStart + this.daySlotsPageSize);
  }

  getWeekdayLabel(date: string): string {
    const dateObj = new Date(`${date}T00:00:00`);
    return dateObj.toLocaleDateString('hu-HU', { weekday: 'short' });
  }

  getDayMonthLabel(date: string): string {
    const dateObj = new Date(`${date}T00:00:00`);
    return dateObj.toLocaleDateString('hu-HU', { month: '2-digit', day: '2-digit' });
  }

  isToday(date: string): boolean {
    return date === this.toDateKey(new Date());
  }

  isSlotSelected(slot: Slot): boolean {
    return !!this.selectedSlot && this.selectedSlot.id === slot.id;
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
    const visibleDates = this.getVisibleDates();
    if (!visibleDates.length) return '2026';
    return visibleDates[0].substring(0, 4);
  }

  private getDefaultWindowStartIndex(): number {
    if (!this.availableDates.length) return 0;

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const firstFutureIndex = this.availableDates.findIndex(date => date >= todayString);

    return firstFutureIndex >= 0 ? firstFutureIndex : 0;
  }

  private ensureSelectedDateVisible(): void {
    if (!this.selectedDate) return;

    const visibleDates = this.getVisibleDates();
    if (!visibleDates.includes(this.selectedDate)) {
      this.selectedDate = null;
      this.selectedSlot = null;
    }
  }

  private getWeekStart(dateValue: Date | string): Date {
    const date = new Date(dateValue);
    const day = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDateLabelShort(date: string): string {
    const dateObj = new Date(`${date}T00:00:00`);
    return dateObj.toLocaleDateString('hu-HU', { month: '2-digit', day: '2-digit' });
  }

  private ensureSelectedSlotVisible(): void {
    if (!this.selectedSlot) return;

    const visibleDays = this.getWeekDays();
    if (!visibleDays.includes(this.selectedSlot.date)) {
      this.selectedSlot = null;
      return;
    }

    this.ensureSlotVisibleInDayPage(this.selectedSlot);
  }

  private ensureSlotVisibleInDayPage(slot: Slot): void {
    const allSlots = this.getSlotsForDate(slot.date);
    const slotIndex = allSlots.findIndex(item => item.id === slot.id);

    if (slotIndex < 0) return;

    const start = Math.floor(slotIndex / this.daySlotsPageSize) * this.daySlotsPageSize;
    this.daySlotStartIndexMap[slot.date] = start;
  }

  private showActionFeedback(type: 'success' | 'error', message: string): void {
    this.actionFeedbackType = type;
    this.actionFeedbackMessage = message;
    this.actionFeedbackVisible = true;

    setTimeout(() => {
      this.actionFeedbackVisible = false;
    }, 1200);
  }
}
