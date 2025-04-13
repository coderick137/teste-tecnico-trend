import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
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
  constructor(private themeService: ThemeService, private router: Router) {
    this.isDarkMode = this.themeService.darkMode$;
  }

  ngOnInit(): void {
    this.themeService.init();

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
}
