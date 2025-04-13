import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';

interface Notification {
  date: string;
  notifications: { message: string }[];
}

export const notificationsByDay: Notification[] = [
  {
    date: '2023-03-01',
    notifications: [
      { message: 'New user registered' },
      { message: 'System update available' },
    ],
  },
  {
    date: '2023-03-02',
    notifications: [
      { message: 'Password changed successfully' },
      { message: 'New comment on your post' },
    ],
  },
  {
    date: '2023-03-03',
    notifications: [
      { message: 'Scheduled maintenance at midnight' },
      { message: 'New follower added' },
    ],
  },
];
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public title = 'Companies';
  public subtitle = 'The companies registered on the Platform';

  public isDarkMode;
  public isSidebarOpen: boolean = false;
  public showSidebarContent: boolean = false;
  public isPopoverOpen: boolean = false;
  public isNotificationsOpen: boolean = false;
  public notificationsByDay: Notification[] = [];
  public hoveredMenuIndex: number | null = null;

  public menus = [
    { label: 'Dashboard', link: '/dashboard', icon: 'dashboard' },
    { label: 'Reports', link: '/reports', icon: 'bar_chart' },
    { label: 'Settings', link: '/settings', icon: 'settings' },
  ];

  constructor(private themeService: ThemeService, private router: Router) {
    this.isDarkMode = this.themeService.darkMode$;
  }

  ngOnInit(): void {
    this.themeService.init();
    this.notificationsByDay.push(...notificationsByDay);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.includes('/register')) {
          this.title = 'Add Company';
          this.subtitle = 'Fill in the details to add a company';
        } else if (this.router.url.includes('/edit')) {
          this.title = 'Edit Company';
          this.subtitle = 'Update company details';
        } else {
          this.title = 'Companies';
          this.subtitle = 'The companies registered on the Platform';
        }
      }
    });
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      setTimeout(() => {
        this.showSidebarContent = true;
      }, 500);
    } else {
      this.showSidebarContent = false;
    }
  }

  togglePopover(): void {
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  toggleNotification(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }
}
