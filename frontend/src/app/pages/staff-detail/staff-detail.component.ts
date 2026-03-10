import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../../services/staff.service';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: []
})
export class StaffDetailComponent implements OnInit {
  staff: any = null;
  loading: boolean = true;
  error: string = '';
  staffId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private staffService: StaffService
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
      return;
    }

    this.loading = false;
  }

  goBack(): void {
    this.router.navigate(['/staff']);
  }

  goToBooking(): void {
    this.router.navigate(['/booking'], {
      queryParams: { staffId: this.staffId }
    });
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
}
