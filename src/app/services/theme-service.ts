import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly darkModeStorageKey = 'theme';

  isDark = false;

  constructor() {
    const saved = localStorage.getItem(this.darkModeStorageKey);
    this.isDark = saved !== null
      ? this.isDark = saved === 'true'
      : this.isDark = false;
    this.apply();
  }

  toggle(): void {
    this.isDark = !this.isDark;
    localStorage.setItem(this.darkModeStorageKey, this.isDark ? "true" : "false");
    this.apply();
  }

  private apply(): void {
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }


}
