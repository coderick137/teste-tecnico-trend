import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(
    localStorage.getItem('dark') === 'true'
  );

  darkMode$ = this.darkMode.asObservable();

  toggleDarkMode(): void {
    const newMode = !this.darkMode.value;
    this.darkMode.next(newMode);
    localStorage.setItem('dark', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  }

  init(): void {
    this.darkMode.next(localStorage.getItem('dark') === 'true');
    document.documentElement.classList.toggle('dark', this.darkMode.value);
  }
}
