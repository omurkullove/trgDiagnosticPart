export function calculateDistances(obj1, obj2, difference, setDistances) {
    const dist = (distance(obj1.x, obj1.y, obj2.x, obj2.y));
    //происводится подсчет dist учитывая разницу между растоянием
    let distWithDifference = dist + (dist * Math.abs(difference) / 100) * (difference > 0 ? 1 : -1);
    //Меняем стейт
    setDistances(prev => [...prev, {[`key`]: distWithDifference, ["a-b"]: `${obj1.dotName} - ${obj2.dotName}`}])
}

//Рассчет дистанции по формуле , которую я упомянул выше
export function distance(x1, y1, x2, y2) {
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) / 3.8; // 1mm = 3.8px
}