import { lowerCase } from 'lodash';

export interface CreateActionType {
  START: string;
  SUCCESS: string;
  ERROR: string;
  END: string;
}

export const createActionType = (
  type: string,
  namespace = 'app'
): CreateActionType => {
  const actions = `@@${lowerCase(namespace)}/${lowerCase(type).replace(
    /\s/g,
    '_'
  )}`; //@@app
  return {
    START: `${actions}_START`,
    SUCCESS: `${actions}_SUCCESS`,
    ERROR: `${actions}_ERROR`,
    END: `${actions}_END`,
  };
};

export const createActionString = (type: string, namespace = 'app'): string => {
  return `@@${lowerCase(namespace)}/${lowerCase(type)}`.replace(/\s/g, '_');
};
