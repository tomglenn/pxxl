const initialState = {
  type: 'PEN',
  color: { r: 0, g: 0, b: 0, a: 1 }
};

const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'SET_PEN':
    case 'SET_ERASER':
      return { ...state, ...action.payload };
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    default:
      return state;
  }
};

export default reducer;
