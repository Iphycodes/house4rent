import { Action } from '../../types';
import { AppReducerState } from '../../types';



export const SceneDefaultState: AppReducerState = {
  search: {},
};

const AppReducer = (state = SceneDefaultState, action: Action) => {
  switch (action.type) {
    

    default:
      return state;
  }
};

export default AppReducer;
