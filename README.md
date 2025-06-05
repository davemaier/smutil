# ai-hooks

[![npm version](https://badge.fury.io/js/%40ai-hooks%2Fclient-react.svg)](https://badge.fury.io/js/%40ai-hooks%2Fclient-react)
[![npm version](https://badge.fury.io/js/%40ai-hooks%2Fclient-solid.svg)](https://badge.fury.io/js/%40ai-hooks%2Fclient-solid)

AI-powered React and SolidJS hooks for translation, text extraction, and image analysis. Get started with intelligent content processing in minutes.

## Features

- 🌍 **Real-time Translation** - Translate text on-the-fly with the `useTranslate` hook
- 📝 **Text Extraction** - Extract and process text content with AI
- 🖼️ **Image Analysis** - Analyze and extract information from images
- ⚛️ **React Support** - Full React 18+ compatibility
- 🎯 **SolidJS Support** - Native SolidJS integration
- 📦 **TypeScript** - Full TypeScript support with type definitions
- 🚀 **Zero Config** - Works out of the box with minimal setup

## Quick Start

### Installation

Install the client package for your framework:

```bash
# For React
npm install @ai-hooks/client-react

# For SolidJS
npm install @ai-hooks/client-solid
```

### Basic Usage

Simple translation example using the `useTranslate` hook:

#### React

```tsx
import { useTranslate } from "@ai-hooks/client-react";

export function Greeting() {
  const { t } = useTranslate("es");
  return <h1>{t("Hello World")}</h1>;
}
```

#### SolidJS

```tsx
import { useTranslate } from "@ai-hooks/client-solid";

export function Greeting() {
  const { t } = useTranslate("es");
  return <h1>{t("Hello World")}</h1>;
}
```

### Advanced Example: Language Switcher

#### React

```tsx
import { useState } from "react";
import { useTranslate } from "@ai-hooks/client-react";

export function LanguageSwitcher() {
  const [lang, setLang] = useState("en");
  const { t, setTargetLanguage } = useTranslate(lang);

  return (
    <div>
      <select
        value={lang}
        onChange={(e) => {
          setLang(e.target.value);
          setTargetLanguage(e.target.value);
        }}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
      <p>
        {t("Selected language:")} {lang}
      </p>
    </div>
  );
}
```

#### SolidJS

```tsx
import { createSignal } from "solid-js";
import { useTranslate } from "@ai-hooks/client-solid";

export function LanguageSwitcher() {
  const [lang, setLang] = createSignal("en");
  const { t, setTargetLanguage } = useTranslate(lang());

  return (
    <div>
      <select
        value={lang()}
        onChange={(e) => {
          setLang(e.target.value);
          setTargetLanguage(e.target.value);
        }}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
      <p>
        {t("Selected language:")} {lang()}
      </p>
    </div>
  );
}
```

## Available Hooks

### Translation

- **`useTranslate`** - Real-time text translation with language switching

### Text Processing

- **`useTextExtract`** - Extract and process text content with AI
- **`useImageExtract`** - Analyze and extract information from images

## Development

This project uses Bun as the package manager and runtime.

### Setup

```bash
bun install
```

### Building

```bash
# Build all packages for production
bun run build:prd

# Build only client packages
bun run build:clients
```

## Project Structure

This is a monorepo containing the following packages:

- **`@ai-hooks/client-react`** - React hooks and components
- **`@ai-hooks/client-solid`** - SolidJS hooks and components
- **`@ai-hooks/core`** - Core AI processing logic
- **`@ai-hooks/server`** - Backend API server -- out of date

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## Support

- 📖 [Documentation](https://docs.ai-hooks.dev)

- 💬 [Discussions](https://discord.gg/BqA2jH6uvv)
