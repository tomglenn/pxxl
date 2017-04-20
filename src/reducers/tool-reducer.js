const initialState = {
  type: 'PEN',
  color: [0, 255, 0, 1]
};

const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'SET_PEN':
    case 'SET_ERASER':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
