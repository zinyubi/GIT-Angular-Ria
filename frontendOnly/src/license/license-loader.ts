// src/license/license-loader.ts
export async function loadLicense(): Promise<void> {
  const response = await fetch('./assets/license/luciadria_development.txt');  // Load from assets
  console.log("Resoponse",response);
  if (!response.ok) {
    throw new Error("License file missing or cannot be loaded");
  }

  const licenseText = await response.text();

  // ✅ LuciadRIA expects the license to be installed globally
  // LicenseInstaller is part of LuciadRIA
  const { setLicenseText } = await import("@luciad/ria/util/License.js");

  try {
    setLicenseText(licenseText);
    console.log("✅ License installed successfully");
  } catch (err) {
    console.error("❌ License installation failed:", err);
    throw err;
  }
}
