import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private companies: any[] = [];

  constructor(private http: HttpClient) {}

  public addCompany(company: any): void {
    const { id, ...companyData } = company;

    const existingCompany = this.companies.find((c) => c.id === id);
    if (existingCompany) {
      this.updateCompany(id, { ...existingCompany, ...companyData });
      return;
    }
    const newCompany = {
      ...companyData,
      thumbnail: null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.http
      .post('http://localhost:3000/companies', newCompany)
      .subscribe((response: any) => {
        this.companies.push(response);
      });
  }

  public getCompanies(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/companies');
  }

  public deleteCompany(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/companies/${id}`).pipe(
      tap(() => {
        this.companies = this.companies.filter((company) => company.id !== id);
      })
    );
  }

  public updateCompany(id: number, updatedCompany: any): void {
    const existingCompany = this.companies.find((company) => company.id === id);
    if (existingCompany) {
      updatedCompany.createdAt = existingCompany.createdAt;
    }

    this.http
      .put(`http://localhost:3000/companies/${id}`, updatedCompany)
      .subscribe(() => {
        const index = this.companies.findIndex((company) => company.id === id);
        if (index !== -1) {
          this.companies[index] = {
            ...updatedCompany,
            createdAt: existingCompany?.createdAt,
          };
        }
      });
  }

  public getCompanyById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/companies/${id}`);
  }
}
