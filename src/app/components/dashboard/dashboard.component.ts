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

  constructor(private themeService: ThemeService) {
    this.isDarkMode = this.themeService.darkMode$;
  }

  ngOnInit(): void {
    this.themeService.init();
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
