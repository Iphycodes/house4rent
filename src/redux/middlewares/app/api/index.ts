import { Middleware } from "redux";
import { batch } from "react-redux";
import { notification } from "antd";
import { capitalize, isEmpty } from "lodash";
import { push } from "connected-next-router";
import { RootState } from "../../../state";
import { createApiRequest } from "../../../../_shared/utils";
import {
  SERVER_REQUEST,
  setUIError,
  setUIPagination,
  startUILoading,
  stopUILoading,
} from "../../../actions";

export const serverRequest: Middleware<unknown, RootState> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (action.type === SERVER_REQUEST.START) {
      const {
        method,
        url,
        key,
        uiKey,
        payload,
        onError,
        successMessage,
        params,
        onSuccess,
        errorMessage,
        onFinish,
        list,
        update,
        noErrorMessage,
        nextRoute,
        metadata = false,
        isExternal = false,
        baseUrl,
        headers = {},
      } = action.meta;
      const config: Record<string, any> = {
        method,
        url,
        data: null,
        params: null,
        isExternal,
      };
      if (baseUrl) {
        config.baseUrl = baseUrl;
      }
      if (payload && (!isEmpty(payload) || payload instanceof FormData)) {
        config.data = payload;
      }

      if (headers && !isEmpty(headers)) {
        config.headers = headers;
      }

      if (params && !isEmpty(params)) {
        config.params = params;
      }

      const requestKey = uiKey || key;

      // dispatched action simultaneously to avoid multiple re-render
      batch(() => {
        dispatch(setUIError(requestKey));
        dispatch(startUILoading(requestKey));
      });

      // make request using axios
      createApiRequest(config)
        .then((serverResponse: Record<string, any>) => {
          const { meta = null } = serverResponse;
          const data = isExternal ? serverResponse : serverResponse?.data ?? {};

          batch(() => {
            // set pagination
            if (meta && meta.pagination)
              dispatch(setUIPagination(requestKey, meta.pagination));
            // on successful http request
            if (onSuccess) {
              if (typeof onSuccess === "function") {
                if (metadata) {
                  onSuccess(serverResponse);
                } else {
                  onSuccess(data);
                }
              } else if (metadata) {
                dispatch({
                  type: onSuccess,
                  payload: serverResponse,
                  key,
                  list,
                  update,
                });
              } else {
                dispatch({ type: onSuccess, payload: data, key, list, update });
              }
              //call onfinish
              if (onFinish && typeof onFinish === "function") onFinish(data);
            }

            // navigate to next route
            if (nextRoute) dispatch(push(nextRoute));
            //stop uis loading
            dispatch(stopUILoading(requestKey));
            const notificationMsg = successMessage || meta?.message;
            if (notificationMsg) {
              notification.success({
                message: capitalize(notificationMsg),
                key,
                duration: 6,
                placement: "bottomLeft",
              });
            }
          });
        })
        .catch((e: any) => {
          // error message display
          const showErrorMessage = (errMessage: string) => {
            if (
              !noErrorMessage &&
              method.toLowerCase() !== "get" &&
              errMessage
            ) {
              notification.error({
                message: capitalize(errMessage),
                key,
                duration: 6,
                placement: "bottomLeft",
              });
            }
          };
          if (onError) {
            if (typeof onError === "function") {
              onError(e);
            } else {
              const message =
                errorMessage ??
                e.message ??
                "There was a problem, please try again";
              dispatch(setUIError(requestKey, message));
              showErrorMessage(message);
            }
          } else {
            const error =
              e?.data?.meta?.error?.message || e?.error || e?.statusText;
            dispatch(setUIError(requestKey, errorMessage ?? error));
            showErrorMessage(errorMessage ?? error);
          }
          dispatch(stopUILoading(requestKey));
        });
    }
    return next(action);
  };
