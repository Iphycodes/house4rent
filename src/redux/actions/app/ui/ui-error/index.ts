import { createActionString } from '@/shared/utils';

export const UI_ERROR = createActionString('UI_ERROR', 'UI');

export const setUIError = (key: string, value?: string) => ({
  type: UI_ERROR,
  key,
  value,
});
