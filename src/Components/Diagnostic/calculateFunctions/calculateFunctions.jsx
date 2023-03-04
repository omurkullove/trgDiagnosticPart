export function calculateDistances(obj1, obj2, difference) {
  const dist = distance(obj1.x, obj1.y, obj2.x, obj2.y);
  //происводится подсчет dist учитывая разницу между растоянием
  let distWithDifference = dist + ((dist * Math.abs(difference)) / 100) * (difference > 0 ? 1 : -1);
  return distWithDifference
}

//Рассчет дистанции по формуле , которую я упомянул выше
export function distance(x1, y1, x2, y2) {
  const xDistance = x2 - x1;
  const yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) / 3.8; // 1mm = 3.8px
}

export function calculateAngleBetweenThreePoints(dot1, dot2, dot3, difference) {
  //calculate AB, BC
  const AB = calculateDistances(dot1, dot2, difference)
  const BC = calculateDistances(dot2, dot3, difference)
  const CA = calculateDistances(dot3, dot1, difference)

  //calculate cosY
  const cosY = (AB*AB + BC*BC - CA*CA) / (2 * AB * BC);
  //create degrees
  const angle = Math.acos(cosY) * (180/Math.PI);
  return angle;
}

export function calculateAngleBetweenFourPoints(dot1, dot2, dot3, dot4) {
  const u1nsl = Math.atan2(dot1.y - dot2.y, dot1.x - dot2.x) - Math.atan2(dot3.y - dot4.y, dot3.x - dot4.x);
  const value = Math.abs(u1nsl) * 180 / Math.PI; // переводим радианы в градусы
  return Math.round(value)
}

export function calculateDistanceBetweenLineAndDot(dot1, dot2, dot3, size){
  let d = Math.abs((dot2.x - dot1.x) * (dot1.y - dot3.y) - (dot1.x - dot3.x) * (dot2.y - dot1.y)) / Math.sqrt(Math.pow(dot2.x - dot1.x, 2) + Math.pow(dot2.y - dot1.y, 2))
  return d
}

export function calculateAngleToTheIntersection(dot1, dot2, dot3, difference){
  const distance = Math.abs((dot1.y - dot2.y) * dot3.x - (dot1.x - dot2.x) * dot3.y + dot1.x * dot2.y - dot1.y * dot2.x) / Math.sqrt(Math.pow(dot1.y - dot2.y, 2) + Math.pow(dot1.x - dot2.x, 2));
  const distWithDifference = distance + ((distance * Math.abs(difference)) / 100) * (difference > 0 ? 1 : -1);
  return distWithDifference
}

export function calculatePerpendicular(dot1, dot2, dot3, dot4, difference) {

  const snp = dot1
  const sna = dot2
  const ias = dot3
  const is = dot4

  // const ias = {x: 702.5, y: 318, dotsId: 9, dotName: 'ias'}
  // const is = {x: 747.5, y: 408, dotsId: 8, dotName: 'is'}
  // const sna = {x: 740.5, y: 323, dotsId: 17, dotName: 'Sna'}
  // const snp = {x: 567.5, y: 358, dotsId: 18,}

  const scale = 100 / difference;

  let a = { x: ias.x - is.x, y: ias.y - is.y };
  let b = { x: snp.x - sna.x, y: snp.y - sna.y };

  let proj_length_px = Math.abs(a.x * b.y - a.y * b.x) / Math.sqrt(b.x ** 2 + b.y ** 2) / 3.8;

  const distance = proj_length_px / scale


  //let distWithDifference = proj_length_px * (Math.abs(difference) / 100) ** (difference > 0 ? 1 : -1) ;
  return proj_length_px;
}
