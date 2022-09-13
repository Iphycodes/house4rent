import { Storage } from './index';

describe('Storage API', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should be defined', () => {
    const storage = new Storage('test-key', {
      storage: 'localStorage',
      prefix: 'test-prefix',
    });
    expect(storage).toBeDefined();
  });

  it('should be able to set and get data', () => {
    const storage = new Storage('test-key', {
      storage: 'localStorage',
      prefix: 'test-prefix',
    });

    storage.set({
      storage: 'localStorage',
      prefix: 'test-prefix',
      key: 'test-key',
      value: 'test-value',
    });
    expect(storage.get()).toEqual({
      storage: 'localStorage',
      prefix: 'test-prefix',
      key: 'test-key',
      value: 'test-value',
    });
  });

  it('should be able to remove data', () => {
    const storage = new Storage('test-key', {
      storage: 'localStorage',
      prefix: 'test-prefix',
    });

    storage.remove();
    expect(storage.get()).toBeNull();
  });

  it('should be able to clear data', () => {
    const storage = new Storage('test-key', {
      storage: 'localStorage',
      prefix: 'test-prefix',
    });

    storage.clear();
    expect(storage.get()).toBeNull();
  });

  it('should be able to update an item', () => {
    const storage = new Storage('test-key', {
      storage: 'localStorage',
      prefix: 'test-prefix',
    });

    const updateCallback = (prevState: any) => {
      return {
        ...prevState,
        value: 'updated-value',
      };
    };
    storage.update(updateCallback);

    expect(storage.get()).toEqual({
      storage: 'localStorage',
      prefix: 'test-prefix',
      value: 'updated-value',
    });
  });

  it('should test storage with an array', () => {
    const storage = new Storage('test-key', [1, 2, 3]);
    expect(storage.get()).toEqual([1, 2, 3]);
    storage.set([4, 5, 6]);
    expect(storage.get()).toEqual([4, 5, 6]);
    storage.update((prevState: any[]): any[] => {
      return [...prevState, 7, 8, 9];
    });
    expect(storage.get()).toEqual([4, 5, 6, 7, 8, 9]);
    storage.removeOne([], (v) => {
      return v !== 9;
    });
    expect(storage.get()).toEqual([4, 5, 6, 7, 8]);
    storage.remove();
    expect(storage.get()).toBeNull();
    storage.set([4, 5, 6]);
    storage.clear();
    expect(storage.get()).toBeNull();
  });

  it('should test storage with a string', () => {
    const storage = new Storage('test-key', 'test-value');
    expect(storage.get()).toEqual('test-value');
    storage.set('updated-value');
    expect(storage.get()).toEqual('updated-value');
    storage.update((prevState: any): any => {
      return prevState + '-updated';
    });

    expect(storage.get()).toEqual('updated-value-updated');
  });

  it('should keep only selected values', () => {
    localStorage.setItem('hello', 'world');
    localStorage.setItem('foo1', 'bar');
    localStorage.setItem('foo2', 'baz');
    localStorage.setItem('foo3', 'baz');

    const values = Storage.keepOnly(['hello']);

    expect(localStorage.getItem('hello')).toBe('world');
    expect(localStorage.length).toBe(1);
    expect(values).toEqual({ hello: 'world' });
  });

  it('should pick only selected values', () => {
    localStorage.setItem('hello', 'world');
    localStorage.setItem('foo1', 'bar');
    localStorage.setItem('foo2', 'baz');
    localStorage.setItem('foo3', 'baz');

    const values = Storage.pick(['hello', 'foo1']);

    expect(localStorage.length).toBe(4);

    expect(values).toEqual({ hello: 'world', foo1: 'bar' });
  });

  it('should get any value', () => {
    localStorage.setItem('hello', 'world');
    localStorage.setItem('foo1', 'bar');
    localStorage.setItem('foo2', 'baz');
    localStorage.setItem('foo3', 'baz');

    const value = Storage.get('hello');
    const value2 = Storage.get('helloWorld');

    expect(localStorage.length).toBe(4);

    expect(value).toEqual('world');
    expect(value2).toBeNull();
  });

  it('should set a value', () => {
    Storage.set('hello', 'world');
    expect(localStorage.getItem('hello')).toBe('world');
  });

  it('should check if key and value exists', () => {
    Storage.set('hello', 'world');
    Storage.set('nullish', null);
    Storage.set('undefined', undefined);
    Storage.set('empty', '');
    Storage.set('zero', 0);
    Storage.set('one', 1);

    expect(Storage.isEmpty('hello')).toBe(false);
    expect(Storage.isEmpty('zero')).toBe(false);

    expect(Storage.isEmpty('nullish')).toBe(false);
    expect(Storage.isEmpty('undefined')).toBe(false);

    expect(Storage.isEmpty('empty')).toBe(true);
    expect(Storage.isEmpty('zero-ish')).toBe(true);
    //
    expect(Storage.hasKey('hello')).toBe(true);
    expect(Storage.hasKey('empty-ish')).toBe(false);
    //
    expect(Storage.hasKeys(['nullish', 'one'])).toBe(true);
    expect(Storage.hasKeys(['nullish', 'two'])).toBe(false);
  });

  it('should remove from storage', () => {
    Storage.set('hello', 'world');
    Storage.set('nullish', null);
    Storage.set('undefined', undefined);
    Storage.set('empty', '');
    Storage.set('zero', 0);
    Storage.set('one', 1);

    Storage.remove('hello');
    Storage.remove('nullish');

    expect(localStorage.length).toBe(4);
  });

  it('should remove all', () => {
    Storage.set('hello', 'world');
    Storage.set('nullish', null);
    Storage.set('undefined', undefined);
    Storage.set('empty', '');
    Storage.set('zero', 0);
    Storage.set('one', 1);

    expect(localStorage.length).toBe(6);
    Storage.removeAll(['hello', 'nullish', 'undefined', 'empty', 'zero']);

    expect(localStorage.length).toBe(1);
  });

  it('should clear storage', () => {
    Storage.set('hello', 'world');
    Storage.set('nullish', null);
    Storage.set('undefined', undefined);
    Storage.set('empty', '');
    Storage.set('zero', 0);
    Storage.set('one', 1);

    expect(localStorage.length).toBe(6);
    Storage.clear();
    expect(localStorage.length).toBe(0);
  });
});
