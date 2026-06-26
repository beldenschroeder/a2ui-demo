import type { ReactComponentImplementation } from '@a2ui/react/v0_9';
import { Catalog } from '@a2ui/web_core/v0_9';
import { CATALOG_ID } from './constants';
import {
  ButtonRegistration,
  CardRegistration,
  TextInputRegistration,
  TextRegistration,
} from './registrations';

/**
 * The Catalog passed to the @a2ui/web_core MessageProcessor.
 *
 * The MessageProcessor uses this to validate agent messages and to render the
 * resulting surface with our React components. Catalog is a class: its
 * constructor takes the registrations as an array and keys them internally by
 * each implementation's `name`.
 */
export const customCatalog = new Catalog<ReactComponentImplementation>(CATALOG_ID, [
  CardRegistration,
  TextRegistration,
  ButtonRegistration,
  TextInputRegistration,
]);
