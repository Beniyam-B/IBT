// [latitude, longitude] - Leaflet takes latitude FIRST. Approximate demo coordinates.
export const KITCHEN = [9.0108, 38.7613];
const AREA_COORDS = {
  Bole: [8.995, 38.7896],
  Kazanchis: [9.0157, 38.7633],
  Megenagna: [9.0205, 38.801],
  Piassa: [9.0345, 38.7503],
  Sarbet: [8.9922, 38.7289],
  CMC: [9.022, 38.82],
};
export const coordsFor = (area) => AREA_COORDS[area] ?? AREA_COORDS.Bole;