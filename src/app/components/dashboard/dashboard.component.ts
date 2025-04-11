import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public isDarkMode;
  public isSidebarOpen: boolean = false;
  public showSidebarContent: boolean = false;

  constructor(private themeService: ThemeService) {
    this.isDarkMode = this.themeService.darkMode$;
  }

  ngOnInit(): void {
    this.themeService.init();
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
}
