import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../services/staff.service';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  staffCount: number = 0;
  doctorCount: number = 0;
  totalBookings: number = 0;
  upcomingBookings: number = 0;
  avgBookingsPerDoctor: number = 0;
  topServices: Array<{ name: string; count: number }> = [];
  topDoctors: Array<{ name: string; specialty: string; count: number }> = [];
  loading: boolean = true;
  error: string = '';
  userName: string | null = null;
  roleId: number | null = null;

  constructor(
    private staffService: StaffService,
    private authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.userName = user?.name || null;
      this.roleId = typeof user?.roleId === 'number' ? user.roleId : Number(user?.roleId);
    });
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.loading = true;

    this.staffService.getStaff().subscribe({
      next: (staffResponse: any) => {
        const staffData = staffResponse?.data || staffResponse || [];
        this.staffCount = staffData.length || 0;
        this.doctorCount = staffData.filter((member: any) => member.role === 'doctor').length;

        this.bookingService.getBookings().subscribe({
          next: (bookingsResponse: any) => {
            const bookingsData = bookingsResponse?.data || bookingsResponse || [];
            this.totalBookings = bookingsData.length;
            this.upcomingBookings = this.countUpcomingBookings(bookingsData);
            this.avgBookingsPerDoctor = this.doctorCount > 0
              ? Number((this.totalBookings / this.doctorCount).toFixed(1))
              : 0;
            this.topServices = this.computeTopServices(bookingsData);
            this.topDoctors = this.computeTopDoctors(bookingsData);
            this.loading = false;
          },
          error: (err) => {
            this.error = 'A foglalási statisztikák betöltése sikertelen.';
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni az adatokat';
        console.error(err);
        this.loading = false;
      }
    });
  }

  getRoleLabel(): string {
    if (this.roleId === 2) return 'Admin nézet';
    if (this.roleId === 1) return 'Orvosi nézet';
    return 'Saját statisztikák';
  }

  isPatientView(): boolean {
    return this.roleId === 0;
  }

  getTotalBookingsLabel(): string {
    return this.isPatientView() ? 'Saját foglalások' : 'Foglalások összesen';
  }

  getTopServicesTitle(): string {
    return this.isPatientView() ? 'Leggyakoribb szolgáltatásai' : 'Népszerű szolgáltatások';
  }

  private countUpcomingBookings(bookingsData: any[]): number {
    const now = new Date();
    return bookingsData.filter((booking: any) => {
      const date = booking.slot?.date;
      const time = booking.slot?.startTime;
      if (!date || !time) return false;
      const start = new Date(`${date}T${(time || '').substring(0, 8) || '00:00:00'}`);
      return !isNaN(start.getTime()) && start >= now;
    }).length;
  }

  private computeTopServices(bookingsData: any[]): Array<{ name: string; count: number }> {
    const map = new Map<string, number>();

    bookingsData.forEach((booking: any) => {
      const serviceName = booking.type?.name || 'Ismeretlen szolgáltatás';
      map.set(serviceName, (map.get(serviceName) || 0) + 1);
    });

    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private computeTopDoctors(bookingsData: any[]): Array<{ name: string; specialty: string; count: number }> {
    const map = new Map<string, { name: string; specialty: string; count: number }>();

    bookingsData.forEach((booking: any) => {
      const name = booking.doctor?.user?.name || 'Ismeretlen orvos';
      const specialty = booking.doctor?.specialty || 'Általános';
      const key = `${name}|${specialty}`;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { name, specialty, count: 1 });
      }
    });

    return [...map.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
