import {
  filter,
  isEmpty,
  isFunction,
  isPlainObject,
  omit as lodashOmit,
  pick,
} from 'lodash';

export interface StorageSetEvent {
  detail: { state: any; storageKey: string; staleState: any };
  bubbles: boolean;
}

export interface StorageUpdateEvent {
  detail: { state: any; storageKey: string; staleState: any };
  bubbles: boolean;
}

export interface StorageGetEvent {
  detail: { data: any; storageKey: string };
  bubbles: boolean;
}

export interface StorageRemoveEvent {
  detail: { storageKey: string };
  bubbles: boolean;
}

export interface EventType {
  get?: string;
  set?: string;
  update?: string;
  remove?: string;
  removeOne?: string;
}

enum StorageEvents {
  get = '@@stm-storage/get',
  set = '@@stm-storage/set',
  update = '@@stm-storage/update',
  remove = '@@stm-storage/remove',
  removeOne = '@@stm-storage/remove-one',
}

/**
 * Stores, Retrieve, Delete and Updates a data in the local storage.
 * @param localStorageKey
 * @param defaultValue
 */

export interface StorageAPI {
  get: () => any;
  set: (data: any) => void;
  update: (updateData: any) => void;
  removeOne: (key: string | string[], removeFn?: (value: any) => any) => void;
  remove: () => void;
}

class Storage implements StorageAPI {
  private readonly storageKey: string;
  private readonly storage: any;
  private events: typeof StorageEvents;

  constructor(
    storageKey: string,
    defaultValue: any = null,
    _events?: EventType
  ) {
    if (!storageKey) throw new Error('Invalid storage key');
    this.storageKey = storageKey;
    this.storage = localStorage.getItem(storageKey);
    this.events = Object.assign({}, StorageEvents, _events);

    if (!this.storage) {
      localStorage.setItem(storageKey, JSON.stringify(defaultValue));
    }
  }

  /**
   * Stores data in localstorage.
   * @param data
   */
  public set(data: any): void {
    // Stores the data in local-storage.
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    // Initializes data to send to listener.
    const eventInit: StorageSetEvent = {
      detail: {
        state: JSON.parse(
          (localStorage.getItem(this.storageKey) || '{}') as string
        ),
        storageKey: this.storageKey,
        staleState: JSON.parse(this.storage || '{}'),
      },
      bubbles: true,
    };
    // Creates a post event.
    /* See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events */
    const postEvent = new CustomEvent(this.events.set, eventInit);

    // Dispatches the event.
    document.dispatchEvent(postEvent);
  }

  /**
   * Retrieves data from local storage
   */
  public get(): any {
    // Retrieves data from local-storage.
    const storage = localStorage.getItem(this.storageKey);
    if (storage) {
      const data = JSON.parse(storage || '{}');
      // Inits event data.
      const eventInit: StorageGetEvent = {
        detail: { data, storageKey: this.storageKey },
        bubbles: true,
      };
      // Creates a pull event.
      /* See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events */
      const pullEvent = new CustomEvent(this.events.get, eventInit);

      // Dispatches pull event.
      document.dispatchEvent(pullEvent);
      return data;
    }
    return null;
  }

  /**
   * Updates a storage value, unlike push, it checks does not reset the data.
   * @param updateCallback
   */
  public update(updateCallback: (prevState: any) => any): void {
    // Finds existing data. in local-storage.
    const storage = localStorage.getItem(this.storageKey);
    if (storage && isFunction(updateCallback)) {
      // Parses data to JS objects.
      const storageValue = JSON.parse(storage || '{}');

      const updatedState = updateCallback(storageValue);

      localStorage.setItem(this.storageKey, JSON.stringify(updatedState));

      // Dispatch event after completion
      const eventInit: StorageUpdateEvent = {
        detail: {
          state: JSON.parse(
            (localStorage.getItem(this.storageKey) || '{}') as string
          ),
          storageKey: this.storageKey,
          staleState: storageValue,
        },
        bubbles: true,
      };

      // Creates a update event.
      /* See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events */
      const updateEvent = new CustomEvent(this.events.update, eventInit);

      // dispatches event.
      document.dispatchEvent(updateEvent);
    }
  }

  /**
   * Removes a nested value from the storage value. Only(Array | Objects)
   * @param key
   * @param removeFn
   */
  public removeOne(
    key: string | string[],
    removeFn?: (value: any) => any
  ): void {
    // Retrieves data.
    const storage = localStorage.getItem(this.storageKey);

    if (storage && key) {
      const storageValue = JSON.parse(storage);

      // Removes data if stored data is an object.
      if (isPlainObject(storageValue)) {
        const newStorageValue = JSON.stringify(lodashOmit(storageValue, key));
        localStorage.setItem(this.storageKey, newStorageValue);
      }

      // Removes data if stored data is an array.
      if (Array.isArray(storageValue) && removeFn) {
        const newStorageValue = JSON.stringify(filter(storageValue, removeFn));
        localStorage.setItem(this.storageKey, newStorageValue);
      }

      // Dispatch event after completion
      const eventInit: StorageRemoveEvent = {
        detail: { storageKey: this.storageKey },
        bubbles: true,
      };
      // Creates a remove event.
      /* See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events */
      const removeEvent = new CustomEvent(this.events.removeOne, eventInit);
      document.dispatchEvent(removeEvent);
    }
  }

  /**
   * Removes a storage data from the local storage
   */
  public remove(): void {
    const eventInit: StorageRemoveEvent = {
      detail: { storageKey: this.storageKey },
      bubbles: true,
    };
    // Creates a remove event.
    /* See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events */
    const removeEvent = new CustomEvent(this.events.remove, eventInit);
    localStorage.removeItem(this.storageKey);

    // dispatches event.
    document.dispatchEvent(removeEvent);
  }

  public clear() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Clears the storage but keeps only the data for the specified keys.
   * @param keys
   */
  static keepOnly(keys: string[]) {
    const values = pick(localStorage, keys);
    localStorage.clear();
    for (const key in values) {
      localStorage.setItem(key, values[key]);
    }
    return values;
  }

  /**
   * Retrieves a storage value.
   * @param key
   */
  static get(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Sets a storage value.
   * @param key
   * @param value
   */
  static set(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  /**
   * Picks storage data from the local storage using the keys.
   * @param keys
   */
  static pick(keys: string[]) {
    return pick(localStorage, keys);
  }

  /**
   * Checks if the storage key exists.
   * @param key
   */
  static hasKey(key: string): boolean {
    return key in localStorage;
  }

  /**
   * Checks if storage data exists and is not empty
   * @param key
   */
  static isEmpty(key: any): boolean {
    return isEmpty(localStorage.getItem(key));
  }

  /**
   * Checks if all the storage keys exist.
   * @param keys
   */
  static hasKeys(keys: string[]): boolean {
    return keys.every((key) => Storage.hasKey(key));
  }

  /**
   * Removes an item from the storage using the key.
   * @param key
   */
  static remove(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Removes all the items from the storage using the keys.
   * @param keys
   */
  static removeAll(keys: string[]) {
    keys.forEach((key) => Storage.remove(key));
  }

  /**
   *
   */
  static clear() {
    localStorage.clear();
  }
}

export { Storage, StorageEvents };
