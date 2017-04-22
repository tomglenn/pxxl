const initialState = {
  width: 20,
  height: 26,
  zoom: 25,
  tool: 'PEN',
  color: { r: 0, g: 0, b: 0, a: 1 }
};

const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, tool: action.payload };
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    default:
      return state;
  }
};

export default reducer;
