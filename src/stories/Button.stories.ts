import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, type Extras } from './Button';
import { expect, fn } from 'storybook/test';
import { mock } from 'vitest-mock-extended';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    extra: mock<Extras>(),
    onClick: fn(),
  },
  tags: ['autodocs'],
  parameters: {
    myAddonParameter: `
<MyComponent boolProp scalarProp={1} complexProp={{ foo: 1, bar: '2' }}>
  <SomeOtherComponent funcProp={(a) => a.id} />
</MyComponent>
`,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Primary: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    primary: true,
    label: 'Button',
    extra: mock<Extras>({ id: 42, name: 'Test Extra' }),
  },
  play: async ({ args, canvas }) => {
    expect(canvas.getByText(args.extra.id, { exact: false })).toBeInTheDocument();
    expect(canvas.getByText(args.extra.name, { exact: false })).toBeInTheDocument();
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
