import { Point } from "../shape/Point.js";
import { UnitOfMeasure } from "../uom/UnitOfMeasure.js";
import { Axis } from "./Axis.js";
import { CoordinateReference } from "./CoordinateReference.js";
/**
 * Options to create cartesian references
 * @since 2020.0
 */
export interface CreateCartesianReferenceOptions {
  /**
   * The unit of measure used for the X-axis.
   */
  xUnitOfMeasure: UnitOfMeasure;
  /**
   * The unit of measure used for the Y-axis.
   */
  yUnitOfMeasure: UnitOfMeasure;
  /**
   * The unit of measure used for the Z-axis.
   */
  zUnitOfMeasure?: UnitOfMeasure;
  /**
   * The direction of the X-axis
   */
  xDirection?: Axis.Direction;
  /**
   * The direction of the Y-axis
   */
  yDirection?: Axis.Direction;
  /**
   * The direction of the Z-axis
   */
  zDirection?: Axis.Direction;
  /**
   * The name of the reference.
   */
  name?: string;
  /**
   * The identifier of the reference. Used in order to be able to use this identifier when you call.
   * {@link getReference}, you need to add the created reference to the
   * reference provider with {@link addReference}.
   */
  identifier?: string;
  /**
   * The authority name of this reference. For example: for the reference "EPSG:4326", the autority name is EPSG.
   */
  authorityName?: string;
  /**
   * The authority code of this reference. For example: for the reference "EPSG:4326", the autority code is 4326.
   */
  authorityCode?: string;
}
/**
 * Creates a non-spatial {@link CoordinateReference} with a
 * {@link CoordinateType.CARTESIAN}. Such a reference is minimally defined by it axes,
 * more specifically the {@link UnitOfMeasure} of the axes.
 *
 * @param options an object literal containing  information required to create the CartesianReference
 * @return The reference.  This reference is a non-spatial reference.
 */
declare function createCartesianReference(options: CreateCartesianReferenceOptions): CoordinateReference;
/**
 * Options to create topocentric references.
 *
 * @since 2021.1
 */
export interface CreateTopocentricReferenceOptions {
  /**
   * The name of the reference.
   */
  name?: string;
  /**
   * The origin point of the topocentric reference.
   * Must be a georeferenced point. For example, a lon-lat-height point defined in WGS 84.
   * The geodetic datum of this point's coordinate reference will also be used by the topocentric reference.
   */
  origin: Point;
  /**
   * The identifier of the reference. Used in order to be able to use this identifier when you call.
   * {@link getReference}, you need to add the created reference to the reference provider with {@link addReference}.
   *
   * @since 2023.0.1
   */
  identifier?: string;
  /**
   * The authority name of this reference. For example: for the reference "EPSG:4326", the autority name is EPSG.
   *
   * @since 2023.0.1
   */
  authorityName?: string;
  /**
   * The authority code of this reference. For example: for the reference "EPSG:4326", the autority code is 4326.
   *
   * @since 2023.0.1
   */
  authorityCode?: string;
}
/**
 * <p>Creates a new topocentric reference based on the given options.</p>
 *
 * <p>A topocentric coordinate system is a right-handed cartesian coordinate system with the following properties:</p>
 * <ul>
 *   <li>Its origin is defined by a georeferenced point.</li>
 *   <li>The y-axis is directed northwards and aligned to intersect with the polar rotational axis of the ellipsoid.</li>
 *   <li>The x-axis is directed eastwards.</li>
 *   <li>The x-y plane is tangential to the ellipsoid at the origin, or at least symmetric with that tangential plane,
 *   in case the origin does not lie on the ellipsoid. This basically means that the axes are straight lines that do not
 *   follow  the curvature of the globe.</li>
 *   <li>The z-axis is perpendicular to the ellipsoid at the origin, and points outwards. In other words, the z-axis is
 *   perpendicular to the x-y plane and denotes height.</li>
 *   <li>The unit of measure on all axes is 'meter'.</li>
 * </ul>
 *
 * The topocentric reference uses the same geodetic datum as the origin point's coordinate reference.
 *
 * @param options the reference options.
 * @return the reference.
 *
 * @since 2021.1
 */
export declare function createTopocentricReference(options: CreateTopocentricReferenceOptions): CoordinateReference;
/**
 * Determines if the reference corresponding to the given identifier is available in this reference provider.
 *
 * <p> To add new references to this reference provider, use {@link addReference}. </p>
 *
 * <p> The references available by default are: </p>
 * <ul>
 *   <li>CRS:1 (Image (pixel) coordinate reference)</li>
 *   <li>CRS:84 (WGS 84)</li>
 *   <li>CRS:83 (NAD 83)</li>
 *   <li>EPSG:4326 (WGS 84)</li>
 *   <li>EPSG:4979 (WGS 84 with ellipsoidal height)</li>
 *   <li>EPSG:4267 (NAD 27)</li>
 *   <li>EPSG:4269 (NAD 83)</li>
 *   <li>EPSG:4978 (WGS 84 Geocentric)</li>
 *   <li>EPSG:32662 (World Equidistant Cylindrical (Plate Carree))</li>
 *   <li>EPSG:32663 (World Equidistant Cylindrical (Ellipsoidal))</li>
 *   <li>EPSG:4087 (World Equidistant Cylindrical (Ellipsoidal))</li>
 *   <li>EPSG:3395 (Mercator)</li>
 *   <li>EPSG:3857 (Web Mercator)</li>
 *   <li>EPSG:900913 (Web Mercator) </li>
 *   <li>EPSG:3995 (Arctic Polar Stereographic)</li>
 *   <li>EPSG:3031 (Antarctic Polar Stereographic)</li>
 *   <li>EPSG:3996 (Australian Antarctic Polar Stereographic) </li>
 *   <li>EPSG:3306 (Maupiti 83 / UTM zone 5S)</li>
 *   <li>EPSG:23035 (Ed50 / 6° UTM zone 35 (CM27)) </li>
 *   <li>EPSG:23036 (Ed50 / 6° UTM zone 36 (CM33))</li>
 *   <li>EPSG:23037 (Ed50 / 6° UTM zone 37 (CM39))</li>
 *   <li>EPSG:23038 (Ed50 / 6° UTM zone 38 (CM45))</li>
 *   <li>EPSG:2154 (RGF93 / Lambert-93)</li>
 *   <li>EPSG:2206 (Ed50 / 3° GK zone 9 (CM27))</li>
 *   <li>EPSG:2207 (Ed50 / 3° GK zone 10 (CM30))</li>
 *   <li>EPSG:2208 (Ed50 / 3° GK zone 11 (CM33))</li>
 *   <li>EPSG:2209 (Ed50 / 3° GK zone 12 (CM36))</li>
 *   <li>EPSG:2210 (Ed50 / 3° GK zone 13 (CM39))</li>
 *   <li>EPSG:2211 (Ed50 / 3° GK zone 14 (CM42))</li>
 *   <li>EPSG:2212 (Ed50 / 3° GK zone 15 (CM45))</li>
 *
 *   <li>EPSG:2319 (ED50 / TM27)</li>
 *   <li>EPSG:2320 (ED50 / TM30)</li>
 *   <li>EPSG:2321 (ED50 / TM33)</li>
 *   <li>EPSG:2322 (ED50 / TM36)</li>
 *   <li>EPSG:2323 (ED50 / TM39)</li>
 *   <li>EPSG:2324 (ED50 / TM42)</li>
 *   <li>EPSG:2325 (ED50 / TM45)</li>
 *
 *   <li>EPSG:5253 (TUREF / TM27)</li>
 *   <li>EPSG:5254 (TUREF / TM30)</li>
 *   <li>EPSG:5255 (TUREF / TM33)</li>
 *   <li>EPSG:5256 (TUREF / TM36)</li>
 *   <li>EPSG:5257 (TUREF / TM39)</li>
 *   <li>EPSG:5258 (TUREF / TM42)</li>
 *   <li>EPSG:5259 (TUREF / TM45)</li>
 *
 *   <li>SR-ORG:7869 (ITRF96 / UTM Zone 35N)</li>
 *   <li>SR-ORG:7870 (ITRF96 / UTM Zone 36N)</li>
 *   <li>SR-ORG:7871 (ITRF96 / UTM Zone 37N)</li>
 *   <li>SR-ORG:7872 (ITRF96 / UTM Zone 38N)</li>
 *
 *   <li>Luciad:XYZ (non-referenced 3D cartesian reference in meters)</li>
 * </ul>
 * @param referenceIdentifier the reference identifier
 * @return <code>true</code> if the reference corresponding to the given identifier is available; false otherwise
 *
 */
declare function isValidReferenceIdentifier(referenceIdentifier: string): boolean;
/**
 * <p>Retrieves the spatial reference corresponding to the given identifier. The vertical
 * reference of the returned reference is defined as Above Mean Sea Level (AMSL).</p>
 *
 * <p>This has an effect on all the z-coordinates of your shapes, which will all be interpreted as AMSL.</p>
 *
 * <p>You can use the {@link isValidReferenceIdentifier} function
 * to test if the reference corresponding to the given identifier is available in this reference provider.
 * To add new references to this reference provider, use {@link addReference}.
 * If the reference is not available, an {@link UnknownIdentifierError} will be thrown.
 * </p>
 *
 * <p>To retrieve a height above terrain reference, use {@link getHeightAboveTerrainReference getHeightAboveTerrainReference}.</p>
 * @param referenceIdentifier the reference identifier
 * @return The requested spatial reference, with its vertical reference defined Above Mean Sea Level (AMSL)
 * @throws {@link UnknownIdentifierError} if the reference corresponding to the given identifier is not available in this reference provider
 **/
declare function getReference(referenceIdentifier: string): CoordinateReference;
/**
 * Adds a {@link CoordinateReference} to this reference provider.
 *
 * <p> From the moment a reference is added to this reference provider it can be retrieved from the
 * {@link getReference} method and
 * {@link isValidReferenceIdentifier} will return true
 * for the reference's identifier. </p>
 *
 * <p> There are two typical scenarios where this method can be used: </p>
 *  <ul>
 *   <li> To add a {@link CoordinateReference} got from the
 *   {@link parseWellKnownText} method </li>
 *   <li> To add a cartesian {@link CoordinateReference} created by
 *   {@link createCartesianReference} </li>
 * </ul>
 *
 * ```javascript
 * [[include:reference/ReferenceProviderSnippets.ts_ADD_REFERENCE_EXAMPLE]]
 * ```
 * @param reference The reference to be added to this reference provider.
 * @param referenceId The identifier for the given reference. If no identifier is provided the
 * <code>reference.identifier</code> property will be used as identifier. If <code>reference.identifier</code> is not defined,
 * an exception will be thrown.
 *
 */
declare function addReference(reference: CoordinateReference, referenceId?: string): void;
/**
 * <p>Retrieves the height above terrain spatial reference corresponding to the given identifier.
 * The vertical reference of the returned reference is defined Above Terrain Surface.
 * This has an effect on all the z-coordinates of your shapes, which will all be interpreted as a height offset from
 * the terrain that is present in your map.</p>
 *
 * <p>The terrain of your map itself is defined in an Above Mean Sea Level (AMSL) reference. As such, a height above
 * terrain reference should be considered as an offset on top of this AMSL terrain data.</p>
 *
 * <p>The {@link isValidReferenceIdentifier} function
 * can be used to test if the reference corresponding to the given identifier is available in this reference provider.
 * To add new references to this reference provider use {@link addReference}.
 * </p>
 *
 * <p>To retrieve an Above Mean Sea Level (AMSL) reference, use {@link getReference}.</p>
 *
 * <p> Note that it is not possible to get a non-spatial height above terrain
 * {@link CoordinateReference}</p>
 *
 * @param referenceIdentifier the reference identifier
 * @return The requested spatial reference with its vertical reference defined as an offset
 *         on top of the terrain data of the map.
 *
 */
declare function getHeightAboveTerrainReference(referenceIdentifier: string): CoordinateReference;
/**
 * An array of reference identifier patterns that are supported by this reference provider. The patterns
 * are returned as RegExp objects.
 */
declare const supportedReferenceIdentifierPatterns: RegExp[];
/**
 * Options for references.
 * @since 2022.0
 */
export interface ReferenceOptions {
  /**
   * The extent of latitude for Polar Stereographic projections, which is how far the projection extends
   * outwards from the poles, in degrees latitude.
   *
   * For example, you can use this to show data located on the south hemisphere,
   * on a map with a north polar stereographic projection.
   *
   * The default value is 90. This extends the polar stereographic projection up to the equator.
   * Values larger than 90 extend the projection beyond the equator.
   * The projection is only defined for extents in range ]0, 180[.
   * Due to the large distortion beyond the equator, it's recommended to not use extents larger than 90.
   *
   * @default 90
   * @since 2022.0
   */
  polarStereographicLatitudeExtent?: number;
}
/**
 * Parses a given WKT-string or a WKT resource identifier (uri) into a <code>CoordinateReference</code> object.
 * @param wktText A reference encoded as Well-Known Text (WKT).
 * @param authorityName The name of the authority that specified the reference. For example, EPSG.
 *                                 By default, this information is parsed from the authority tags in the WKT string.
 * @param authorityCode The identifier of the reference. For example, 4326.
 *                                 By default, this information is parsed from the authority tags in the WKT string.
 * @param options options for the WKT parsing or reference creation.
 * @return  The reference corresponding to the WKT-string. If the authority
 *                                                 name and code were not present in the WKT string or given when
 *                                                 calling this method, the identifier of this reference is undefined
 *
 * To be able to get this <code>CoordinateReference</code> when you call
 * {@link getReference}, you need to add it to the
 * reference provider with {@link addReference} first.
 */
declare function parseWellKnownText(wktText: string, authorityName?: string, authorityCode?: string, options?: ReferenceOptions): CoordinateReference;
export { isValidReferenceIdentifier, getReference, addReference, getHeightAboveTerrainReference, parseWellKnownText, supportedReferenceIdentifierPatterns, createCartesianReference };