import { serverRequest as serverRequestMiddleware } from './index';
import {
  SERVER_REQUEST,
  serverRequest as apiRequestAction,
} from '../../../actions';
import { POST } from '../../../../_shared/constants';

jest.mock('../../../../_shared/utils/api/index');
jest.mock('../../../actions/app/ui/ui-error');
jest.mock('../../../actions/app/ui/ui-loading');
jest.mock('../../../actions/app/ui/ui-pagination');

describe('Application: server Request', () => {
  const mockedRedux: Record<string, any> = {};
  const apiPayload = { email: 'test@exmaple.com', password: '#test+password!' };
  let apiRequest = apiRequestAction;

  beforeEach(() => {
    mockedRedux.auth = {};
    mockedRedux.nextMock = jest.fn();
    mockedRedux.requestMock = jest.fn();
    apiRequest = jest.fn(apiRequestAction).mockReturnValue({
      type: SERVER_REQUEST.START,
      meta: {
        method: POST,
        url: '/test-url',
        key: 'test-key',
        noErrorMessage: false,
        onSuccess: jest.fn(),
        payload: apiPayload,
      },
    });

    //  createApiRequest.mockRejectedValue({_meta: {status: 400, message: 'Request failed'}});
    mockedRedux.store = {
      dispatch: jest.fn((action) => action),
      getState: jest.fn(),
    };
    mockedRedux.store.getState.mockReturnValue({
      app: {
        auth: mockedRedux.auth,
        districts: [],
      },
      router: {
        location: {
          search: '?url=test',
        },
      },
    });
    mockedRedux.apiRequestAction = serverRequestMiddleware(mockedRedux.store)(
      mockedRedux.nextMock
    );
  });

  it('should not dispatch the apiRequest action since it is not in the targeted list of actions', () => {
    mockedRedux.apiRequestAction({
      type: 'SOME_ACTION',
    });
    mockedRedux.apiRequestAction({
      type: 'SOME_ACTION_2',
    });
    mockedRedux.apiRequestAction({
      type: 'SOME_ACTION_3',
    });
    expect(apiRequest).not.toHaveBeenCalled();
    expect(mockedRedux.nextMock).toHaveBeenCalledWith({ type: 'SOME_ACTION' });
  });
});
