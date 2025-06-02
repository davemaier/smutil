import { createContext, useContext, JSX } from "solid-js";
import type { ClientConfig } from "./types/config.js";

// Create the context with undefined as default value
const HooxonConfigContext = createContext<ClientConfig | undefined>(undefined);

interface HooxonConfigProviderProps {
  config: ClientConfig;
  children: JSX.Element;
}

/**
 * Provider component for global hooxon configuration
 *
 * @example
 * ```tsx
 * <HooxonConfigProvider config={{ apiUrl: "https://api.example.com" }}>
 *   <App />
 * </HooxonConfigProvider>
 * ```
 */
export function HooxonConfigProvider(props: HooxonConfigProviderProps) {
  return (
    <HooxonConfigContext.Provider value={props.config}>
      {props.children}
    </HooxonConfigContext.Provider>
  );
}

/**
 * Hook to access the global hooxon configuration
 *
 * @returns The global configuration object or undefined if not provided
 */
export function useHooxonConfig(): ClientConfig | undefined {
  return useContext(HooxonConfigContext);
}

/**
 * Custom hook to merge local config with global config
 * Priority: local config > global config > fallback
 *
 * @param localConfig - Configuration provided directly to the hook
 * @returns Merged configuration
 */
export function useHooxonMergedConfig(
  localConfig?: ClientConfig
): ClientConfig {
  const globalConfig = useHooxonConfig();

  // If local config is provided, it takes precedence
  if (localConfig) {
    return localConfig;
  }

  // Otherwise use global config if available
  if (globalConfig) {
    return globalConfig;
  }

  // Fallback to empty config (will use environment variables)
  return {};
}
