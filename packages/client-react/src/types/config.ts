/**
 * Configuration options for the client hooks
 */
export interface ClientConfig {
  /**
   * The base URL for API requests
   * If not provided, the API_BASE_URL environment variable will be used
   */
  apiUrl?: string;

  /**
   * The default language for translations
   * This will be used as a fallback if no language is specified in the useTranslate hook
   */
  language?: string;
}
