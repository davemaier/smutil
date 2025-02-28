import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { ClientConfig } from "./types/config";

// Create the context with undefined as default value
const SmutilConfigContext = createContext<ClientConfig | undefined>(undefined);

interface SmutilConfigProviderProps {
  config: ClientConfig;
  children: ReactNode;
}

/**
 * Provider component for global smutil configuration
 *
 * @example
 * ```tsx
 * <SmutilConfigProvider config={{ apiUrl: "https://api.example.com" }}>
 *   <App />
 * </SmutilConfigProvider>
 * ```
 */
export function SmutilConfigProvider({
  config,
  children,
}: SmutilConfigProviderProps) {
  return (
    <SmutilConfigContext.Provider value={config}>
      {children}
    </SmutilConfigContext.Provider>
  );
}

/**
 * Hook to access the global smutil configuration
 *
 * @returns The global configuration object or undefined if not provided
 */
export function useSmutilConfig(): ClientConfig | undefined {
  return useContext(SmutilConfigContext);
}

/**
 * Custom hook to merge local config with global config
 * Priority: local config > global config > fallback
 *
 * @param localConfig - Configuration provided directly to the hook
 * @returns Merged configuration
 */
export function useSmutilMergedConfig(
  localConfig?: ClientConfig
): ClientConfig {
  const globalConfig = useSmutilConfig();

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
