import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';  // <-- Import this
import { AppComponent } from './app/app.component';
import { loadLicense } from './license/license-loader';
import { appConfig } from './app/app.config';

(async () => {
  try {
    await loadLicense();

    await bootstrapApplication(AppComponent, {
      ...appConfig,
      providers: [
        ...appConfig.providers,   // preserve existing providers
        provideHttpClient(),      // <-- Add this here
      ],
    });
  } catch (err) {
    document.body.innerHTML = "<h2>License error. Please update license.txt</h2>";
  }
})();
