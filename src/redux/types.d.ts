type T = Record<string, any>;

export type RequestMethod = "get" | "post" | "put" | "delete" | "patch";

export interface RequestInterface {
  // http request methods
  method: RequestMethod;
  // request url
  url: string;
  // identifier fro uis updates
  key?: string;
  // data sent to the server
  payload?: any;
  // function called if http request is successful
  onSuccess?: ((data?: T | Array<T>) => void) | string;
  // function called after successful http request
  onFinish?: ((data?: T | Array<T>) => void) | string;
  // function called if http request failed
  onError?: ((error?: T | Array<T>) => void) | string;
  // url query params
  params?: any;
  // specify success message to display to user
  successMessage?: string;
  // specify error message to display to user
  errorMessage?: string;
  // to redirect on successful http request
  nextRoute?: string;
  // show if success message should be displayed or not
  noSuccessMessage?: boolean;
  // show if error message should be displayed or not
  noErrorMessage?: boolean;
  //Used to return the metadata from an API request
  metadata?: boolean;
  // Used to denote if request is to an external API
  isExternal?: boolean;

  headers?: Record<string, any> | Headers;
}

export interface Action {
  type: any;
  payload?: any;
  key?: string | number | symbol | any;
  alternateKey?: string | number | symbol | any;
  value?: any;
  meta?: any;
  _id?: string;
  virtualized?: boolean;
  list?: boolean;
  update?: boolean;
}

export interface ActionOption extends Partial<RequestInterface> {
  params?: Record<string, any>;
  key?: string;
  alternateKey?: string;
  uiKey?: string;
  onFinish?: (data: Record<string, any>) => void;
  onAfterError?: (error: Record<string, any> | string) => void;
  successMessage?: string;
  errorMessage?: string;
  virtualized?: boolean;
  suffix?: string;
  urlSuffix?: string;
  method?: string;
  list?: boolean;
  update?: boolean;
}

export interface AppReducerState {
  search: Record<string, UserNamespace.User>;
}
