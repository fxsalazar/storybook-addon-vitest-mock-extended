// You can use presets to augment the Storybook configuration
// You rarely want to do this in addons,
// so often you want to delete this file and remove the reference to it in package.json#exports and package.json#bunder.nodeEntries
// Read more about presets at https://storybook.js.org/docs/addons/writing-presets

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const viteFinal: StorybookConfig['viteFinal'] = async (config) => {
  // Skip when running inside Vitest -- the alias would break Vitest's own
  // imports from 'vitest/internal/browser' and other sub-paths.
  if (process.env.VITEST) {
    return config;
  }

  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};

  // Redirect `import { vi } from 'vitest'` to our shim so that
  // vitest-mock-extended uses Storybook's fn() instead of pulling
  // in the full Vitest runtime (which crashes in the browser).
  const aliases = config.resolve.alias as Record<string, string>;
  aliases['vitest'] = path.resolve(dirname, 'vitest-shim.js');

  return config;
};
