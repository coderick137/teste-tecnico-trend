import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { CompaniesListComponent } from './components/companies-list/companies-list.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: CompaniesListComponent },
      { path: 'register', component: CompanyFormComponent },
      { path: 'edit/:id', component: CompanyFormComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
