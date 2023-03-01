export function calculateDistances(obj1, obj2, difference, setDistances) {
  const dist = distance(obj1.x, obj1.y, obj2.x, obj2.y);
  //происводится подсчет dist учитывая разницу между растоянием
  let distWithDifference =
    dist + ((dist * Math.abs(difference)) / 100) * (difference > 0 ? 1 : -1);
  //Меняем стейт

  setDistances(prev => [
    ...prev,
    {
      [`key`]: distWithDifference,
      ["a-b"]: `${obj1.dotName} - ${obj2.dotName}`,
    },
  ]);
}

//Рассчет дистанции по формуле , которую я упомянул выше
export function distance(x1, y1, x2, y2) {
  const xDistance = x2 - x1;
  const yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) / 3.8; // 1mm = 3.8px
}

export function calculateAngleBetweenThreePoints(x1, y1, x2, y2, x3, y3) {
  // Calculate vectors AB and BC
  const AB = { x: x2 - x1, y: y2 - y1 };
  const BC = { x: x3 - x2, y: y3 - y2 };

  // Calculate dot product of AB and BC
  const dotProduct = AB.x * BC.x + AB.y * BC.y;

  // Calculate magnitudes of AB and BC
  const magnitudeAB = Math.sqrt(AB.x ** 2 + AB.y ** 2);
  const magnitudeBC = Math.sqrt(BC.x ** 2 + BC.y ** 2);

  // Calculate cosine of angle between AB and BC
  const cosAngle = dotProduct / (magnitudeAB * magnitudeBC);

  // Calculate angle in radians
  const angleRadians = Math.acos(cosAngle);

  // Convert angle from radians to degrees
  const angleDegrees = (angleRadians * 180) / Math.PI;

  // Return angle in degrees
  return angleDegrees;
}
