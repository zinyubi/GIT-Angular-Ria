import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/core/auth/login/login.component';
import { loadLicense } from './license/license-loader';
import { appConfig } from './app/app.config';

/**
 * Bootstraps the Angular application after loading the LuciadRIA license.
 * 
 * The flow is:
 * 1. Attempt to load the license via `loadLicense()`.
 * 2. If successful, bootstrap the Angular application with `AppComponent` and `appConfig`.
 * 3. If license loading fails, display an error message to the user.
 */
(async () => {
  try {
    await loadLicense(); // Load LuciadRIA license before app startup
    await bootstrapApplication(AppComponent, appConfig)
      .catch(err => console.error(err));
  } catch (err) {
    // Display license error message in the DOM if license fails to load/install
    document.body.innerHTML = "<h2>License error. Please update license.txt</h2>";
  }
})();
