export const NUM_AXES = 5;
export const MAX_VALUE = 100;

export function getPointCoordinates(
  value: number,
  index: number,
  cx: number,
  cy: number,
  radius: number
) {
  // Start at top (-90 degrees)
  const angle = (Math.PI / 2) - (2 * Math.PI * index / NUM_AXES);
  const r = (value / MAX_VALUE) * radius;
  return {
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle) // SVG y goes down
  };
}

export function getPolygonPath(
  values: number[],
  cx: number,
  cy: number,
  radius: number
) {
  const points = values.map((val, i) => {
    const { x, y } = getPointCoordinates(val, i, cx, cy, radius);
    return `${x},${y}`;
  });
  return points.join(' ');
}
