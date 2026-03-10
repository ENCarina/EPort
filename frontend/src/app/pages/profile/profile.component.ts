import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: []
})
export class ProfileComponent implements OnInit {
  user: any = null;
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  message: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  handlePasswordChange(): void {
    this.error = '';
    this.message = '';

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.error = 'Az új jelszavak nem egyeznek';
      return;
    }

    if (!this.user?.id) {
      this.error = 'Felhasználó nem található';
      return;
    }

    this.loading = true;
    this.userService.updatePassword(this.user.id, {
      oldPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: () => {
        this.message = 'Jelszó sikeresen frissítve!';
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Nem sikerült frissíteni a jelszót';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
