import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../service/company.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css',
})
export class CompanyFormComponent {
  readonly companyForm;
  public companyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      cnpj: ['', Validators.required],
      description: [''],
      thumbnail: [null],
      active: [true],

      address: this.fb.group({
        neighborhood: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),

      contact: this.fb.group({
        phone: [''],
        email: ['', [Validators.required, Validators.email]],
      }),
      createdAt: [new Date().toISOString()],

      // Módulos ativáveis
      enableCSAT: [false],
      enableAI: [false],
      enableTrendVoip: [false],

      // Limites máximos
      maxCloudApi: [0, [Validators.min(0)]],
      maxBusiness: [0, [Validators.min(0)]],
      maxBusinessPro: [0, [Validators.min(0)]],

      // Plano
      monthlyValue: [0, [Validators.min(0)]],
      recurrence: ['Mensal'],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.companyId = idParam ? +idParam : null;
    if (this.companyId) {
      this.loadCompanyData(+this.companyId);
    }
  }

  get contact() {
    return this.companyForm.get('contact');
  }

  get address() {
    return this.companyForm.get('address');
  }

  async onSave(): Promise<void> {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (this.companyForm.value.id) {
        this.companyService.updateCompany(
          this.companyForm.value.id,
          this.companyForm.value
        );
        alert('Empresa atualizada com sucesso!');
      } else {
        this.companyService.addCompany(this.companyForm.value);
        alert('Empresa cadastrada com sucesso!');
      }
      this.router.navigate(['/']);
    } catch (error) {
      alert('Erro ao salvar empresa.');
      console.error(error);
    }
  }

  async loadCompanyData(companyId: number): Promise<void> {
    try {
      this.companyService.getCompanyById(companyId).subscribe({
        next: (company) => {
          if (company) {
            this.companyForm.patchValue(company);
          } else {
            alert('Empresa não encontrada.');
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          alert('Erro ao carregar dados da empresa.');
          console.error(error);
        },
      });
    } catch (error) {
      alert('Erro ao carregar dados da empresa.');
      console.error(error);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }
}
