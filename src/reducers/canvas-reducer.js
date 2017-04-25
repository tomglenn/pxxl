const initialState = {
  width: 20,
  height: 20,
  zoom: 20,
  tool: 'PEN',
  color: { r: 0, g: 0, b: 0, a: 1 },
  showGrid: true,
  showExport: true,
  saving: false
};

const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, tool: action.payload };
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    case 'SET_SIZE':
      return { ...state, width: action.payload.width, height: action.payload.height };
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    case 'TOGGLE_GRID':
      return { ...state, showGrid: !state.showGrid };
    case 'TRIGGER_SAVING':
      return { ...state, saving: true };
    case 'TRIGGER_SAVED':
      return { ...state, saving: false };
    default:
      return state;
  }
};

export default reducer;
