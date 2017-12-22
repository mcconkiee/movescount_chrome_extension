const gpxs = (state = {}, action) => {
  switch (action.type) {
    case 'SET_GPX':
      return action.gpx;
    default:
      return state;
  }
};

export default gpxs;
