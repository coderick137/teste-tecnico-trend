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
    const newCompany = {
      ...company,
      id: this.companies.length + 1,
      thumbnail: null,
      active: true,
      createdAt: new Date().toISOString(),
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

  public deleteCompany(id: number): Observable<any[]> {
    return this.http
      .delete<any[]>(`http://localhost:3000/companies/${id}`)
      .pipe(
        tap(() => {
          this.companies = this.companies.filter(
            (company) => company.id !== id
          );
        })
      );
  }

  public updateCompany(id: number, updatedCompany: any): void {
    this.http
      .put(`http://localhost:3000/companies/${id}`, updatedCompany)
      .subscribe(() => {
        const index = this.companies.findIndex((company) => company.id === id);
        if (index !== -1) {
          this.companies[index] = updatedCompany;
        }
      });
  }

  public getCompanyById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/companies/${id}`);
  }
}
