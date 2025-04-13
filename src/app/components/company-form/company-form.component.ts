import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../service/company.service';
import { CommonModule } from '@angular/common';
import { maskZipCode, maskCNPJ, maskPhone } from '../../utils/utils';
import { firstValueFrom } from 'rxjs';

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
  public formattedMonthlyValue: string = 'R$ 0,00';

  maskCNPJ = maskCNPJ;
  maskPhone = maskPhone;
  maskZipCode = maskZipCode;

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

      // Activatable modules
      enableCSAT: [false],
      enableAI: [false],
      enableTrendVoip: [false],

      // Maximum limits
      maxCloudApi: [0, [Validators.min(0)]],
      maxBusiness: [0, [Validators.min(0)]],
      maxBusinessPro: [0, [Validators.min(0)]],

      // Plan
      monthlyValue: [0, [Validators.min(0)]],
      recurrence: ['Monthly'],
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
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (this.companyForm.value.id) {
        this.companyService.updateCompany(
          this.companyForm.value.id,
          this.companyForm.value
        );
        alert('Company successfully updated!');
      } else {
        this.companyService.addCompany(this.companyForm.value);
        alert('Company successfully registered!');
      }
      this.router.navigate(['/']);
    } catch (error) {
      alert('Error saving company.');
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
            alert('Company not found.');
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          alert('Error loading company data.');
          console.error(error);
        },
      });
    } catch (error) {
      alert('Error loading company data.');
      console.error(error);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }

  onCNPJChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const cnpjControl = this.companyForm.get('cnpj');
    if (cnpjControl && inputElement) {
      cnpjControl.setValue(maskCNPJ(inputElement.value || ''));
    }
  }

  onPhoneChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const phoneControl = this.companyForm.get('contact.phone');
    if (phoneControl && inputElement) {
      phoneControl.setValue(maskPhone(inputElement.value || ''));
    }
  }

  onZipCodeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const rawCep = inputElement.value || '';
    const maskedCep = maskZipCode(rawCep);
    const onlyDigits = rawCep.replace(/\D/g, '');

    const cepControl = this.companyForm.get('address.zipCode');
    if (cepControl) {
      cepControl.setValue(maskedCep, { emitEvent: false });
    }

    if (onlyDigits.length === 8) {
      this.fillAddressData(onlyDigits);
    }
  }

  onCurrencyChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const rawValue = inputElement.value.replace(/\D/g, '');
    const numericValue = parseFloat(rawValue) / 100 || 0;

    this.formattedMonthlyValue = numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    this.companyForm.get('monthlyValue')?.setValue(numericValue);
  }

  async fillAddressData(zipCode: string): Promise<void> {
    try {
      const addressData = await firstValueFrom(
        this.companyService.getAddressByZipCode(zipCode)
      );

      if (addressData && !addressData.erro) {
        this.address?.patchValue({
          neighborhood: addressData.bairro,
          city: addressData.localidade,
          state: addressData.uf,
          zipCode: zipCode,
        });
      } else {
        alert('Endereço não encontrado para o CEP informado.');
      }
    } catch (error) {
      alert('Erro ao buscar os dados do endereço.');
      console.error(error);
    } finally {
      const zipCodeControl = this.companyForm.get('address.zipCode');
      if (zipCodeControl) {
        zipCodeControl.setValue(maskZipCode(zipCode), { emitEvent: false });
      }
    }
  }
}
