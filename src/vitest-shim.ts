import { fn } from 'storybook/test';

/**
 * Shim for vitest-mock-extended: provides vi.fn() backed by storybook/test.
 * In Storybook's browser runtime, each story gets a fresh mock instance
 * from its args definition, so no cross-story state leakage occurs.
 */
export const vi = { fn };
