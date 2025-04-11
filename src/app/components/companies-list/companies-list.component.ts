import { Component } from '@angular/core';
import { CompanyService } from '../../service/company.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies-list',
  imports: [CommonModule],
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.css',
})
export class CompaniesListComponent {
  public companies: any[] = [];

  constructor(private companyService: CompanyService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllCompanies();
  }
  public loadAllCompanies() {
    this.companyService.getCompanies().subscribe((data: any) => {
      this.companies = data;
    });
  }

  public deleteCompany(id: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(id).subscribe(() => {
        this.loadAllCompanies();
      });
    }
  }

  public goToRegister(): void {
    console.log('Navigating to register page...');
    this.router.navigate(['/register']);
  }
}
