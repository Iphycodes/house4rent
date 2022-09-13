import { createActionString, createActionType } from './';

describe('Actions Factory', () => {
  it('should create an action string with default APP', () => {
    const actionString = createActionString('test');
    expect(actionString).toBe('@@app/test');
  });

  it('should create an action string with type "custom type" and namespace test', () => {
    const actionString = createActionString('custom type', 'test');
    expect(actionString).toBe('@@test/custom_type');
  });

  it('should create an action type with default APP', () => {
    const actionType = createActionType('test');
    expect(actionType).toEqual({
      START: '@@app/test_START',
      SUCCESS: '@@app/test_SUCCESS',
      ERROR: '@@app/test_ERROR',
      END: '@@app/test_END',
    });
  });

  it('should create an action type with type "custom type" and namespace test', () => {
    const actionType = createActionType('custom type', 'test');
    expect(actionType).toEqual({
      START: '@@test/custom_type_START',
      SUCCESS: '@@test/custom_type_SUCCESS',
      ERROR: '@@test/custom_type_ERROR',
      END: '@@test/custom_type_END',
    });
  });
});
