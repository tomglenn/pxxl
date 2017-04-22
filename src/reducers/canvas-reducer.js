const initialState = {
  width: 20,
  height: 20,
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
    case 'SET_SIZE':
      return { ...state, width: action.payload.width, height: action.payload.height };
    default:
      return state;
  }
};

export default reducer;
