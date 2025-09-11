// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { loadLicense } from './license/license-loader';

(async () => {
  try {
    await loadLicense();               // ✅ Ensure license is loaded first
    await bootstrapApplication(AppComponent);
  } catch (err) {
    document.body.innerHTML = "<h2>License error. Please update license.txt</h2>";
  }
})();
