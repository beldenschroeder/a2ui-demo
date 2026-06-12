import type { Catalog, ReactComponentImplementation } from '@a2ui/react/v0_9';
import { CATALOG_ID } from './constants';
import {
  ButtonRegistration,
  CardRegistration,
  TextInputRegistration,
  TextRegistration,
} from './registrations';

/**
 * The Catalog object passed to the @a2ui/web_core MessageProcessor.
 *
 * The MessageProcessor uses this to validate agent messages and to render the
 * resulting surface with our React components.
 */
export const customCatalog: Catalog<ReactComponentImplementation> = {
  id: CATALOG_ID,
  components: {
    Card: CardRegistration,
    Text: TextRegistration,
    Button: ButtonRegistration,
    TextInput: TextInputRegistration,
  },
};
