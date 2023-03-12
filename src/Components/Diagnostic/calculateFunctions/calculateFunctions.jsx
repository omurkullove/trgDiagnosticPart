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

export function calculateDistanceBetweenLineAndDot(dot1, dot2, dot3, difference) {
    let d = Math.abs((2 * dot2.x - 2 * dot1.x) * (dot1.y - dot3.y) - (dot1.x - dot3.x) * (2 * dot2.y - 2 * dot1.y)) / (Math.sqrt(Math.pow(2 * (dot2.x - dot1.x), 2) + Math.pow(2 * (dot2.y - dot1.y), 2))) / 3.8;
    let distWithDifference = d + ((d * Math.abs(difference)) / 100) * (difference > 0 ? 1 : -1);
    return distWithDifference.toFixed(2);
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
    const snp = dot1;
    const sna = dot2;
    const ias = dot3;
    const is = dot4;

    const d = Math.abs((snp.y - sna.y) * is.x - (snp.x - sna.x) * is.y + snp.x * sna.y - snp.y * sna.x) / Math.sqrt((snp.y - sna.y) ** 2 + (snp.x - sna.x) ** 2) / 3.8;
    const d_line = Math.sqrt((snp.x - sna.x) ** 2 + (snp.y - sna.y) ** 2) / 3.8;
    const sin_alpha = d / d_line;
    const u1_nl = d  * sin_alpha ;
    let distWithDifference = u1_nl + ((u1_nl * Math.abs(difference)) / 100) * (difference > 0 ? 1 : -1);

    return distWithDifference.toFixed(2);
}

export function findDotOnLineAndCalculateDistance(dot1, dot2, dot3, dot4, difference) {
    const sna = dot1;
    const snp = dot2;
    const is = dot3;
    const ias = dot4;

    const v_ias_is = { x: is.x - ias.x, y: is.y - ias.y };
    const v_sna_snp = { x: snp.x - sna.x, y: snp.y - sna.y };
    const n_sna_snp = { x: -v_sna_snp.y, y: v_sna_snp.x, z: 0 }; // векторное произведение между v_sna_snp и (0, 0, 1)

    const t = (n_sna_snp.x * (sna.x - ias.x) + n_sna_snp.y * (sna.y - ias.y)) / (n_sna_snp.x * v_ias_is.x + n_sna_snp.y * v_ias_is.y);
    const A1 = { x: ias.x + t * v_ias_is.x, y: ias.y + t * v_ias_is.y };

    const dist = Math.sqrt(Math.pow(A1.x - snp.x, 2) + Math.pow(A1.y - snp.y, 2)) / 3.8;
    let distWithDifference = dist + ((dist * Math.abs(difference)) / 100) * (difference > 0 ? 1 : -1);
    return distWithDifference.toFixed(2)
}

export function findDotsMlOcP(is, ii, mm, Me, Go) {
    const E1 = {x: is.x - ((is.x - ii.x) / 2), y: is.y - ((is.y - ii.y) / 2)}
    const angle = calculateAngleBetweenFourNotConcernPoint(E1, mm, Me, Go)
    return angle
}

export function findWits(A, B, is, ii, mm, difference) {
    const E1 = {x: is.x - ((is.x - ii.x) / 2), y: is.y - ((is.y - ii.y) / 2)}

    const k = (E1.y - mm.y) / (E1.x - mm.x);
    // Рассчитываем свободный коэффициент прямой
    const b = E1.y - k * E1.x;
    // Рассчитываем расстояния от точек A и B до прямой через точки E1 и mm
    const dA = Math.abs(-k * A.x + A.y - b) / Math.sqrt(k * k + 1);
    const dB = Math.abs(-k * B.x + B.y - b) / Math.sqrt(k * k + 1);
    const A1dot = {y: A.y + Number(dA), x: A.x}
    const B1dot = {y: B.y - Number(dB), x: B.x}
    const distance = calculateDistances(A1dot, B1dot, difference)
    return distance
}
