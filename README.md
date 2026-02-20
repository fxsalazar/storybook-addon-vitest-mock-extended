# Storybook Addon vitest-mock-extended

## Installation

First, install the package.

```sh
npm install --save-dev @fxsalazar/storybook-addon-vitest-mock-extended
```

Then, register it as an addon in `.storybook/main.js`.

```ts
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  // ...rest of config
  addons: [
    '@storybook/addon-docs'
    '@fxsalazar/storybook-addon-vitest-mock-extended', // 👈 register the addon here
  ],
};

export default config;
```

## Usage

Now you can use vitest-mock-extended in your stories like you would normally do in your tests.

```ts
// Page.stories.ts

// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';
import { mock } from 'vitest-mock-extended';

import { Page } from './Page';
import type { Service } from './service';

const meta: Meta<typeof Page> = {
  component: Page,
  args: {
    service: mock<Service>(), // Example of using vitest-mock-extended in a story
  },
  parameters: {
    myAddon: {
      exampleParameter: true,
      // See API section below for available parameters
    },
  }
};

export default meta;
```

For more information about how to use vitest-mock-extended, please refer to the [vitest-mock-extended documentation](https://github.com/eratio08/vitest-mock-extended)
