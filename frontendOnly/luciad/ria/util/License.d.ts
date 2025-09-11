/**
 * Sets the license data to the given text.
 * @param licenseText The text contents of the license file you were given by Luciad's customer services department.
 *
 * The example shows how to load the contents of the license file as a string. Here the license information is bundled
 * in your application distribution package with the aid of webpack's loader (raw-loader).
 *
 * ```javascript
 * // LicenseLoader.js
 * import {setLicenseText} from "@luciad/ria/util/License.js";
 * import license from "raw-loader!./luciadria_development.txt.js";
 * setLicenseText(license);
 * ```
 */
declare function setLicenseText(licenseText: string): void;
/**
 * Tells LuciadRIA to load the license information from the given url.
 * @param url The url from where to load the license data. The url is loaded as is, and the response is
 * handled as UTF-8 encoded text data.
 * @return The promise for the license data. You do not need to wait for this Promise yourself, LuciadRIA will
 * wait for the url to be loaded before performing the license check.
 *
 * The example shows how to load the license information from a URL.
 * Here the URL points to a location relative to the application root.
 *
 * ```javascript
 * // LicenseLoader.js
 * import {loadLicenseFromUrl} from "@luciad/ria/util/License.js";
 * loadLicenseFromUrl("luciadria_deployment.txt");
 * ```
 */
declare function loadLicenseFromUrl(url: string): Promise<string>;
/**
 * Tells LuciadRIA to load the license information from the choice of urls.
 * This function can be used to load a development license or a deployment license, depending which one is provided,
 * or to load a license served from various locations.
 * @param urls The array of urls to load the license data from. License data is loaded from the first url location which yields data.
 *
 * @return The promise for the license data. You do not need to wait for this Promise yourself, LuciadRIA will
 * wait for the url to be loaded before performing the license check.
 *
 * The example shows how to load the license information either from the "luciadria_development.txt" URL or
 * "luciadria_deployment.txt" URL, depending which one gets resolved first.
 * Here both URLs point to locations relative to the application root.
 *
 * ```javascript
 * // LicenseLoader.js
 * import {loadLicenseFromUrls} from "@luciad/ria/util/License.js";
 * loadLicenseFromUrls(["luciadria_development.txt", "luciadria_deployment.txt"]);
 * ```
 */
declare function loadLicenseFromUrls(urls: string[]): Promise<string>;
export { setLicenseText, loadLicenseFromUrl, loadLicenseFromUrls };