import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../service/company.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css',
})
export class CompanyFormComponent {
  readonly companyForm;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      id: [null], // Added 'id' property
      name: ['', Validators.required],
      cnpj: ['', Validators.required],
      description: [''],
      chanels: [1, Validators.required],
      thumbnail: [null],
      users: [1, Validators.required],
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
    });
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
        console.log('Atualizando empresa:', this.companyForm.value);
        this.companyService.updateCompany(
          this.companyForm.value.id,
          this.companyForm.value
        );
        alert('Empresa atualizada com sucesso!');
      } else {
        console.log('Cadastrando empresa:', this.companyForm.value);
        this.companyService.addCompany(this.companyForm.value);
        alert('Empresa cadastrada com sucesso!');
      }
      this.router.navigate(['/']);
    } catch (error) {
      alert('Erro ao salvar empresa.');
      console.error(error);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }
}
