// src/license/license-loader.ts

/**
 * Loads and installs the LuciadRIA license from a local asset file.
 * 
 * This function:
 * - Fetches the license text from `./assets/license/luciadria_development.txt`.
 * - Throws an error if the license file cannot be loaded.
 * - Dynamically imports the LuciadRIA `setLicenseText` function.
 * - Installs the license globally for LuciadRIA usage.
 * 
 * @throws Will throw an error if the license file is missing or the installation fails.
 */
export async function loadLicense(): Promise<void> {
  const response = await fetch('./assets/license/luciadria_development.txt');  // Load from assets

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
