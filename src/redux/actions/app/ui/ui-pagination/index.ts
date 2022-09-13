import { createActionString } from '@/shared/utils';

export const UI_PAGINATION = createActionString('UI_PAGINATION', 'UI');

export const setUIPagination = (key: string, value: Record<string, any>) => ({
  type: UI_PAGINATION,
  key,
  value,
});
