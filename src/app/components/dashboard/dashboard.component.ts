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
  public title = 'Empresas';
  public subtitle = 'As emprasas cadastradas na Plataforma';

  public isDarkMode;
  public isSidebarOpen: boolean = false;
  public showSidebarContent: boolean = false;

  constructor(private themeService: ThemeService, private router: Router) {
    this.isDarkMode = this.themeService.darkMode$;
  }

  ngOnInit(): void {
    this.themeService.init();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.includes('/register')) {
          this.title = 'Adicionar Empresa';
          this.subtitle = 'Preencher dados para adicionar empresa';
        } else if (this.router.url.includes('/edit')) {
          this.title = 'Editar Empresa';
          this.subtitle = 'Alterar dados da empresa';
        } else {
          this.title = 'Empresas';
          this.subtitle = 'As empresas cadastradas na Plataforma';
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
}
