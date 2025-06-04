import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { ClientConfig } from "./types/config";

// Create the context with undefined as default value
const AiHooksConfigContext = createContext<ClientConfig | undefined>(undefined);

interface AiHooksConfigProviderProps {
  config: ClientConfig;
  children: ReactNode;
}

/**
 * Provider component for global ai-hooks configuration
 *
 * @example
 * ```tsx
 * <AiHooksConfigProvider config={{ apiUrl: "https://api.example.com" }}>
 *   <App />
 * </AiHooksConfigProvider>
 * ```
 */
export function AiHooksConfigProvider({
  config,
  children,
}: AiHooksConfigProviderProps) {
  return (
    <AiHooksConfigContext.Provider value={config}>
      {children}
    </AiHooksConfigContext.Provider>
  );
}

/**
 * Hook to access the global ai-hooks configuration
 *
 * @returns The global configuration object or undefined if not provided
 */
export function useAiHooksConfig(): ClientConfig | undefined {
  return useContext(AiHooksConfigContext);
}

/**
 * Custom hook to merge local config with global config
 * Priority: local config > global config > fallback
 *
 * @param localConfig - Configuration provided directly to the hook
 * @returns Merged configuration
 */
export function useAiHooksMergedConfig(
  localConfig?: ClientConfig
): ClientConfig {
  const globalConfig = useAiHooksConfig();

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
