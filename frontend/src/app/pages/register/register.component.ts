import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleSubmit(): void {
    this.error = '';

    if (this.password !== this.confirmPassword) {
      this.error = 'A jelszavak nem egyeznek';
      return;
    }

    this.loading = true;

    this.authService.register(this.email, this.password, this.name).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Sikertelen regisztráció';
        this.loading = false;
      }
    });
  }
}
