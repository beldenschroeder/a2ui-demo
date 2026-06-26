import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'path';

const root = path.resolve(__dirname, '../../../');

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: 'tag' },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      plugins: [vanillaExtractPlugin()],
      resolve: {
        alias: {
          '@a2ui-demo/button': path.join(root, 'packages/button/src/index.ts'),
          '@a2ui-demo/card': path.join(root, 'packages/card/src/index.ts'),
          '@a2ui-demo/text': path.join(root, 'packages/text/src/index.ts'),
          '@a2ui-demo/text-input': path.join(root, 'packages/text-input/src/index.ts'),
          '@a2ui-demo/catalog': path.join(root, 'packages/catalog/src/index.ts'),
        },
      },
    });
  },
};

export default config;
