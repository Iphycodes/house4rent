import { createActionType } from '@/shared/utils';

export const UI_LOADING = createActionType('UI_LOADING', 'UI');

export const stopUILoading = (key: string) => ({
  type: UI_LOADING.END,
  key,
});

export const startUILoading = (key: string) => ({
  type: UI_LOADING.START,
  key,
});
