export function calculateDistances(obj1, obj2, difference) {
    const dist = distance(obj1.x, obj1.y, obj2.x, obj2.y);
    //происводится подсчет dist учитывая разницу между растоянием
    let distWithDifference =
        dist + ((dist * Math.abs(difference)) / 100) * (difference > 0 ? 1 : -1);
    return distWithDifference.toFixed(2);
}

//Рассчет дистанции по формуле , которую я упомянул выше
export function distance(x1, y1, x2, y2) {
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) / 3.8; // 1mm = 3.8px
}

export function calculateAngleBetweenThreePoints(dot1, dot2, dot3, difference) {
    //calculate AB, BC
    const AB = calculateDistances(dot1, dot2, difference);
    const BC = calculateDistances(dot2, dot3, difference);
    const CA = calculateDistances(dot3, dot1, difference);

    //calculate cosY
    const cosY = (AB * AB + BC * BC - CA * CA) / (2 * AB * BC);
    //create degrees
    const angle = Math.acos(cosY) * (180 / Math.PI);
    return angle.toFixed(2);
}

export function calculateAngleBetweenFourPoints(dot1, dot2, dot3, dot4) {
    const u1nsl =
        Math.atan2(dot1.y - dot2.y, dot1.x - dot2.x) -
        Math.atan2(dot3.y - dot4.y, dot3.x - dot4.x);
    const value = (Math.abs(u1nsl) * 180) / Math.PI; // переводим радианы в градусы
    return value.toFixed(2);
}

export function calculateAngleBetweenFourNotConcernPoint(dot1, dot2, dot3, dot4) {

// Вычисляем векторы
    const NSL = {x: dot3.x - dot4.x, y: dot3.y - dot4.y};
    const NL = {x: dot1.x - dot2.x, y: dot1.y - dot2.y};

// Вычисляем длины векторов
    const NSLLength = Math.sqrt(NSL.x * NSL.x + NSL.y * NSL.y);
    const NLLength = Math.sqrt(NL.x * NL.x + NL.y * NL.y);

// Вычисляем скалярное произведение векторов
    const dotProduct = NSL.x * NL.x + NSL.y * NL.y;

// Вычисляем угол в радианах
    const cosTheta = dotProduct / (NSLLength * NLLength);
    const theta = Math.acos(cosTheta);

// Переводим угол в градусы
    const angleInDegrees = theta * 180 / Math.PI;
    return angleInDegrees.toFixed(2);
}

export function calculateDistanceBetweenLineAndDot(dot1, dot2, dot3, size) {
    let d =
        Math.abs(
            (dot2.x - dot1.x) * (dot1.y - dot3.y) -
            (dot1.x - dot3.x) * (dot2.y - dot1.y)
        ) / Math.sqrt(Math.pow(dot2.x - dot1.x, 2) + Math.pow(dot2.y - dot1.y, 2));
    return d.toFixed(2);
}

export function calculateAngleToTheIntersection(dot1, dot2, dot3, difference) {
    const distance =
        Math.abs(
            (dot1.y - dot2.y) * dot3.x -
            (dot1.x - dot2.x) * dot3.y +
            dot1.x * dot2.y -
            dot1.y * dot2.x
        ) / Math.sqrt(Math.pow(dot1.y - dot2.y, 2) + Math.pow(dot1.x - dot2.x, 2));
    const distWithDifference =
        distance +
        ((distance * Math.abs(difference)) / 100) * (difference > 0 ? 1 : -1);
    return distWithDifference.toFixed(2);
}

export function calculatePerpendicular(dot1, dot2, dot3, dot4, difference) {
    //нерабочая формула
    const sna = dot1;
    const snp = dot2;
    const is = dot3;
    const ias = dot4;


    const a = {x: is.x - ias.x, y: is.y - ias.y};
    const b = {x: snp.x - sna.x, y: snp.y - sna.y};

    const projLength = Math.abs(a.x * b.y - a.y * b.x) / Math.sqrt(b.x ** 2 + b.y ** 2) / 3.8;

    let distWithDifference = projLength + ((projLength * Math.abs(difference)) / 100) * (difference > 0 ? 1 : -1);

    return distWithDifference.toFixed(2);
}
