import React, { useState, useEffect } from "react";

function MouseCoordinates() {
  const [dots, setDots] = useState([]);
  const [distances, setDistances] = useState([]);

  function handleMouseClick(event) {
    const { clientX, clientY } = event;
    const pointNumber = dots.length + 1;
    const pointKey = `point${pointNumber}`;
    const newPoint = { [pointKey]: { x: clientX, y: clientY } };
    setDots([...dots, newPoint]);
  }

  function calculateDistances() {
    const newDistances = [];
    for (let i = 0; i < dots.length - 1; i += 2) {
      const point1Key = Object.keys(dots[i])[0];
      const point2Key = Object.keys(dots[i + 1])[0];
      const dist = distance(
        dots[i][point1Key].x,
        dots[i][point1Key].y,
        dots[i + 1][point2Key].x,
        dots[i + 1][point2Key].y
      );
      newDistances.push({ [`${point1Key}-${point2Key}`]: `${dist} mm` });
    }
    setDistances(newDistances);
  }

  function distance(x1, y1, x2, y2) {
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }

  useEffect(() => {
    if (dots.length % 2 === 0) {
      calculateDistances();
    }
  }, [dots]);

  return (
    <div onClick={handleMouseClick}>
      <p>dots:</p>
      {dots.map(point => (
        <div key={Object.keys(point)[0]}>
          <p>
            {Object.keys(point)[0]}: {JSON.stringify(Object.values(point)[0])}
          </p>
        </div>
      ))}
      <p>Distances:</p>
      {distances.map(dist => (
        <div key={Object.keys(dist)[0]}>
          <p>
            {Object.keys(dist)[0]}: {Object.values(dist)[0]}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MouseCoordinates;
