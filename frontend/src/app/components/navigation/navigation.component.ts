import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: []
})
export class NavigationComponent implements OnInit {
  userName: string | null = null;
  userRoleId: number | null = null;
  currentPath: string = '';
  isMenuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.userName = user?.name || null;
      this.userRoleId = user?.roleId ?? null;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.url;
        this.closeMenu();
      });
  }

  isActive(path: string): boolean {
    return this.currentPath === path;
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
  }

  getMyBookingsLabel(): string {
    return this.userRoleId === 2 ? 'Időpontok' : 'Időpontjaim';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
