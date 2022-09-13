import { createActionType } from '../../../../_shared/utils';
import { RequestInterface } from '../../../types';

export const SERVER_REQUEST = createActionType('SERVER_REQUEST', 'APP');

export const serverRequest = (meta: RequestInterface) => ({
  type: SERVER_REQUEST.START,
  meta,
});

export default serverRequest;