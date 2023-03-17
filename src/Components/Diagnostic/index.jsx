import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./index.module.scss";
//Assets
import DivideSVG from "./Assets/Vector 273Divide.svg";
import InvertOnSVG from "./Assets/Lamp_duotone_lineon.svg";
import InvertOffSVG from "./Assets/Lampoff.svg";
import BrightConfigSVG from "./Assets/Color_Mode.svg";
import RotateRightSVG from "./Assets/Refreshright.svg";
import RotateLeftSVG from "./Assets/Refreshleft.svg";
import ZoomInSVG from "./Assets/Add_ringzoomIn.svg";
import ZoomOutSVG from "./Assets/Add_ring_fillzoomout.svg";
import PointslOffSVG from "./Assets/Targetoff.svg";
import PointsOnSVG from "./Assets/Targeton.svg";
import LinesOffSVG from "./Assets/Filter_bigoff.svg";
import LinesOnSVG from "./Assets/Filter_bigon.svg";
import { Fade, Menu } from "@mui/material";
import Slider from "@mui/material/Slider";
import star1 from "../TagFile/Assets/star1.svg";
import star2 from "../TagFile/Assets/star2.svg";

import loadingSVG from "./Assets/loading.svg";
import DoneSVG from "./Assets/Done.svg";
import deleteSVG from "./Assets/delete.svg";
import { DOTS_INFO } from "./dotsInfoArr";
import {
  calculateAngleBetweenFourNotConcernPoint,
  calculateAngleBetweenFourPoints,
  calculateAngleBetweenThreePoints,
  calculateDistanceBetweenLineAndDot,
  calculateDistances,
  calculatePerpendicular,
  findDotOnLineAndCalculateDistance,
  findDotsMlOcP,
  findWits,
} from "./calculateFunctions/calculateFunctions";
import { Link, useNavigate } from "react-router-dom";
import { setAddToLs } from "../../Slices/TrgSlice";

const Diagnostic = ({ patientInfo }) => {
  //Canvas Logic

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [dots, setDots] = useState([]);
  const [dotsId, setDotsId] = useState(1);

  const [isDotsVisible, setIsDotsVisible] = useState(true);
  const [isLinesVisible, setIsLinesVisible] = useState(true);

  const dispatch = useDispatch();

  const [currentDocumentWidth, setCurrentDocumentWidth] = useState(
    document.documentElement.clientWidth || document.body.clientWidth
  );

  const [currentDotDiameter, setCurrentDotDiameter] = useState(1.5);

  useEffect(() => {
    setCurrentDocumentWidth(
      document.documentElement.clientWidth || document.body.clientWidth
    );
    // if (currentDocumentWidth <= 768 && currentDocumentWidth > 375) {
    //     setCurrentDotDiameter(3);
    // }
    // if (currentDocumentWidth <= 375) {
    //     setCurrentDotDiameter(1);
    // }
    // if (currentDocumentWidth > 768) {
    //     setCurrentDotDiameter(3);
    // }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    contextRef.current.fillStyle = "red";
    const cs = getComputedStyle(canvas);
    const widthC = parseInt(cs.getPropertyValue("width"), 10);
    const heightC = parseInt(cs.getPropertyValue("height"), 10);
    canvas.width = widthC;
    canvas.height = heightC;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);

    //Показать точки
    dots.forEach((dot, index) => {
      if (isDotsVisible) {
        contextRef.current.fillStyle = "red";
        contextRef.current.beginPath();
        contextRef.current.arc(
          dot.x,
          dot.y,
          currentDotDiameter,
          0,
          2 * Math.PI
        );
        contextRef.current.fill();
      }

      if (index > 0 && isLinesVisible) {
        //Показать/Убрать линии
        Renderlines();
      }
    });
  }, [dots, isDotsVisible, isLinesVisible]);

  function handleAddDot(event) {
    if (dots.length < DOTS_INFO.length) {
      const canvas = canvasRef.current;
      setDotsId(prev => prev + 1);
      const rect = canvas.parentNode.getBoundingClientRect();

      // const x = event.clientX - rect.left;
      // const y = event.clientY - rect.top;
      const x = (event.clientX - rect.left) / scale; // обратное масштабирование
      const y = (event.clientY - rect.top) / scale;
      setDots(prev => [
        ...dots,
        { x, y, dotsId, dotName: DOTS_INFO[dotsId - 1].name },
      ]);
    } else {
      return;
    }
  }

  //Логика отображения линий и точек

  function handleToggleDotsVisibility() {
    setIsDotsVisible(false);
  }

  function handleToggleDotsVisibilityTrue() {
    setIsDotsVisible(true);
  }

  function handleToggleLinesVisibility() {
    setIsLinesVisible(false);
  }

  function handleToggleLinesVisibilityTrue() {
    setIsLinesVisible(true);
  }

  //(Шаг назад)-удаление крайней точки
  function removeDot(index, name) {
    setDots(prevArray => prevArray.slice(0, -1));
    setDotsId(prevState => prevState - 1);
  }

  const [isButton, setIsButton] = useState(false);

  //Dashboard
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Логика просчета дистанции
  const [distances, setDistances] = useState([]);

  //Разница между нашими мм и теми что на картинке
  const [difference, setDifference] = useState(0);

  //--------------------Логика рендеринга линий-------------------------
  //Группа функций для рендеринга линий
  const LineFunctionGroup = {
    //Многоразоваая функция для двух точек аргументом принемает объект
    twoPoint(point1, point2) {
      contextRef.current.moveTo(point1.x, point1.y);
      contextRef.current.lineTo(point2.x, point2.y);
    },

    //Многоразоваая функция для трех точек аргументом принемает объект
    threePoint(point1, point2, point3) {
      contextRef.current.moveTo(point1.x, point1.y);
      contextRef.current.lineTo(point2.x, point2.y);
      contextRef.current.lineTo(point3.x, point3.y);
    },

    //Многоразоваая функция для четырех точек аргументом принемает объект
    fourPoint(point1, point2, point3, point4) {
      contextRef.current.moveTo(point1.x, point1.y);
      contextRef.current.lineTo(point2.x, point2.y);
      contextRef.current.lineTo(point3.x, point3.y);
      contextRef.current.lineTo(point4.x, point4.y);
    },
  };

  //Фунция рендеринга линий
  const Renderlines = () => {
    contextRef.current.strokeStyle = "red";
    contextRef.current.lineWidth = 0.3;

    if (dots.some(item => item.dotName === "N")) {
      const S = dots.find(obj => obj.dotName === "S");
      const N = dots.find(obj => obj.dotName === "N");
      LineFunctionGroup.twoPoint(S, N);
    }
    if (dots.some(item => item.dotName === "A")) {
      const N = dots.find(obj => obj.dotName === "N");
      const A = dots.find(obj => obj.dotName === "A");

      LineFunctionGroup.twoPoint(N, A);
    }
    if (dots.some(item => item.dotName === "B")) {
      const N = dots.find(obj => obj.dotName === "N");
      const B = dots.find(obj => obj.dotName === "B");

      LineFunctionGroup.twoPoint(N, B);
    }
    if (dots.some(item => item.dotName === "ias")) {
      const is = dots.find(obj => obj.dotName === "is");
      const ias = dots.find(obj => obj.dotName === "ias");

      LineFunctionGroup.twoPoint(is, ias);
    }
    if (dots.some(item => item.dotName === "iai")) {
      const ii = dots.find(obj => obj.dotName === "ii");
      const iai = dots.find(obj => obj.dotName === "iai");

      LineFunctionGroup.twoPoint(ii, iai);
    }
    if (dots.some(item => item.dotName === "Ar")) {
      const N = dots.find(obj => obj.dotName === "N");
      const S = dots.find(obj => obj.dotName === "S");
      const Ar = dots.find(obj => obj.dotName === "Ar");

      LineFunctionGroup.threePoint(N, S, Ar);
    }

    if (dots.some(item => item.dotName === "Pg")) {
      const Go = dots.find(obj => obj.dotName === "Go");
      const Me = dots.find(obj => obj.dotName === "Me");
      const Gn = dots.find(obj => obj.dotName === "Gn");
      const Pg = dots.find(obj => obj.dotName === "Pg");

      LineFunctionGroup.fourPoint(Go, Me, Gn, Pg);
    }
    if (dots.some(item => item.dotName === "Co")) {
      const Go = dots.find(obj => obj.dotName === "Go");
      const Co = dots.find(obj => obj.dotName === "Co");

      LineFunctionGroup.twoPoint(Go, Co);
    }
    if (dots.some(item => item.dotName === "sn")) {
      const Pg = dots.find(obj => obj.dotName === "Pg");
      const Sn = dots.find(obj => obj.dotName === "sn");

      LineFunctionGroup.twoPoint(Pg, Sn);
    }
    if (dots.some(item => item.dotName === "Snp")) {
      const Sna = dots.find(obj => obj.dotName === "Sna");
      const Snp = dots.find(obj => obj.dotName === "Snp");

      LineFunctionGroup.twoPoint(Sna, Snp);
    }
    if (dots.some(item => item.dotName === "Ar")) {
      const Ar = dots.find(obj => obj.dotName === "Ar");
      const Go = dots.find(obj => obj.dotName === "Go");

      LineFunctionGroup.twoPoint(Ar, Go);
    }
    contextRef.current.stroke();
  };
  //------------------------------------------------------

  useEffect(() => {
    // тут проводится проверка на то есть ли обьекты в массиве дистанций
    if (
      distances.some(dis => typeof dis === "object" && dis !== null) &&
      distances[0].value !== 10
    ) {
      //берется первый обьект, он должен быть первыми точками которые служал для определение нашим мм и тех что на картинки
      //значени 30 это значение которое должен выбрать пользователь на линейке для праильного понимая системой картинки
      const newDifference =
        ((10 - distances[0].value) / distances[0].value) * 100;
      //все преобразовал в проценты, это проценты разницы между картинкой и нашими мм для корректного отображения на всех разрешениях экрана
      setDifference(newDifference);
    }

    //условия для выполнения формул
    if (dots.some(item => item.dotName === "10mm") && dots.length <= 2) {
      const value = calculateDistances(dots[0], dots[1], difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: value,
          ["key"]: "mm",
          ["name"]: `${dots[0].dotName} - ${dots[1].dotName}`,
        },
      ]);
      console.log(value);
    }
    const indexA = DOTS_INFO.findIndex(item => item.name === "A") + 1;
    if (dots.some(item => item.dotName === "A") && dots.length <= indexA) {
      const dots1 = dots.find(obj => obj.dotName === "S");
      const dots2 = dots.find(obj => obj.dotName === "N");
      const dots3 = dots.find(obj => obj.dotName === "A");
      const angle = calculateAngleBetweenThreePoints(
        dots1,
        dots2,
        dots3,
        difference
      );
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["name"]: `SNA`,
        },
      ]);
      console.log(angle, "SNA");
    }
    const indexB = DOTS_INFO.findIndex(item => item.name === "B") + 1;
    if (dots.some(item => item.dotName === "B") && dots.length <= indexB) {
      const S = dots.find(obj => obj.dotName === "S");
      const N = dots.find(obj => obj.dotName === "N");
      const B = dots.find(obj => obj.dotName === "B");
      const A = dots.find(obj => obj.dotName === "A");
      const angle = calculateAngleBetweenThreePoints(S, N, B, difference);
      const ANB = calculateAngleBetweenThreePoints(A, N, B, difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["name"]: `SNB`,
        },
        {
          [`value`]: ANB,
          ["key"]: "deg",
          ["name"]: `ANB`,
        },
      ]);
      console.log(angle, "SNB");
      console.log(ANB, "ANB");
    }
    const indexPg = DOTS_INFO.findIndex(item => item.name === "Pg") + 1;
    if (dots.some(item => item.dotName === "Pg") && dots.length <= indexPg) {
      const S = dots.find(obj => obj.dotName === "S");
      const N = dots.find(obj => obj.dotName === "N");
      const B = dots.find(obj => obj.dotName === "B");
      const Pg = dots.find(obj => obj.dotName === "Pg");
      const angle = calculateAngleBetweenThreePoints(S, N, Pg, difference);
      const angle2 = calculateDistanceBetweenLineAndDot(
        N,
        B,
        Pg,
        distances[0].value
      );
      const Go = dots.find(obj => obj.dotName === "Go");
      const Me = dots.find(obj => obj.dotName === "Me");
      const Gn = dots.find(obj => obj.dotName === "Gn");
      const PgGn = calculateDistances(Pg, Gn, difference);
      const GnMe = calculateDistances(Gn, Me, difference);
      const MeGo = calculateDistances(Me, Go, difference);
      const PgGo = Number(PgGn) + Number(GnMe) + Number(MeGo);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["name"]: `SNPg`,
        },
        {
          [`value`]: PgGo.toFixed(2),
          ["key"]: "mm",
          ["name"]: `Pg’-Go`,
        },
        {
          [`value`]: angle2,
          ["key"]: "mm",
          ["name"]: `Pg-NB`,
        },
      ]);
      console.log(angle, "SNPg");
      console.log(PgGo, "Pg’-Go");
      console.log(angle2, "Pg-NB");
    }
    const indexIas = DOTS_INFO.findIndex(item => item.name === "ias") + 1;
    if (dots.some(item => item.dotName === "ias") && dots.length <= indexIas) {
      const S = dots.find(obj => obj.dotName === "S");
      const N = dots.find(obj => obj.dotName === "N");
      const is = dots.find(obj => obj.dotName === "is");
      const ias = dots.find(obj => obj.dotName === "ias");
      const angle = calculateAngleBetweenFourPoints(S, N, is, ias);
      const value = calculateDistances(S, N, difference);

      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["name"]: `U1-NSL (SN)`,
        },
        {
          [`value`]: value,
          ["key"]: "mm",
          ["name"]: `N-S`,
        },
      ]);
      console.log(angle, "U1-NSL (SN)");
      console.log(value, "N-S");
    }
    const indexSnp = DOTS_INFO.findIndex(item => item.name === "Snp") + 1;
    if (dots.some(item => item.dotName === "Snp") && dots.length <= indexSnp) {
      const is = dots.find(obj => obj.dotName === "is");
      const N = dots.find(obj => obj.dotName === "N");
      const ias = dots.find(obj => obj.dotName === "ias");
      const Snp = dots.find(obj => obj.dotName === "Snp");
      const Sna = dots.find(obj => obj.dotName === "Sna");
      const A = dots.find(obj => obj.dotName === "A");
      const S = dots.find(obj => obj.dotName === "S");
      const U6 = dots.find(obj => obj.dotName === "U6");
      const angle = calculateAngleBetweenFourPoints(is, ias, Snp, Sna);
      const NLNSL = calculateAngleBetweenFourNotConcernPoint(N, S, Sna, Snp);
      const A1Snp = findDotOnLineAndCalculateDistance(
        Sna,
        Snp,
        is,
        ias,
        difference
      );
      const U1Nl = calculatePerpendicular(Snp, Sna, ias, is, difference);
      const NSna = calculateDistances(N, Sna, difference);
      const SnpS = calculateDistances(S, Snp, difference);
      const U6Nl = calculatePerpendicular(Snp, Sna, U6, U6, difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["name"]: `U1-NL (SNA-SNP)`,
        },
        {
          [`value`]: A1Snp,
          ["key"]: "mm",
          ["name"]: `A1-SNP`,
        },
        {
          [`value`]: U1Nl,
          ["key"]: "mm",
          ["name"]: `U1-NL`,
        },
        {
          [`value`]: NSna,
          ["key"]: "mm",
          ["name"]: `N - Sna`,
        },
        {
          [`value`]: SnpS,
          ["key"]: "mm",
          ["name"]: `Snp - S`,
        },
        {
          [`value`]: NLNSL,
          ["key"]: "deg",
          ["name"]: `NL/NSL`,
        },
        {
          [`value`]: U6Nl,
          ["key"]: "mm",
          ["name"]: `NL/NSL`,
        },
      ]);
      console.log(angle, "U1-NL (SNA-SNP)");
      console.log(U1Nl, "U1-NL");
      console.log(A1Snp, "A1-SNP");
      console.log(NSna, "N - Sna");
      console.log(SnpS, "Snp - S");
      console.log(NLNSL, "NL/NSL");
      console.log(U6Nl, "U6/NL");
    }
    const indexMe = DOTS_INFO.findIndex(item => item.name === "Me") + 1;
    if (dots.some(item => item.dotName === "Me") && dots.length <= indexMe) {
      const ias = dots.find(obj => obj.dotName === "ias");
      const Sna = dots.find(obj => obj.dotName === "Sna");
      const Snp = dots.find(obj => obj.dotName === "Snp");
      const N = dots.find(obj => obj.dotName === "N");
      const S = dots.find(obj => obj.dotName === "S");
      const ii = dots.find(obj => obj.dotName === "ii");
      const iai = dots.find(obj => obj.dotName === "iai");
      const Go = dots.find(obj => obj.dotName === "Go");
      const Me = dots.find(obj => obj.dotName === "Me");
      const Gn = dots.find(obj => obj.dotName === "Gn");
      const L6 = dots.find(obj => obj.dotName === "L6");
      const mm = dots.find(obj => obj.dotName === "mm");
      const is = dots.find(obj => obj.dotName === "is");
      const A = dots.find(obj => obj.dotName === "A");
      const B = dots.find(obj => obj.dotName === "B");
      const angle = calculateAngleBetweenFourPoints(ias, ii, Me, Go);
      const SGo = calculateDistances(S, Go, difference);
      const NGn = calculateDistances(N, Gn, difference);
      const SnaGn = calculateDistances(Sna, Gn, difference);
      const MLNSL = calculateAngleBetweenFourNotConcernPoint(Me, Go, N, S);
      const L1Ml = calculatePerpendicular(Go, Me, iai, ii, difference);
      const L6Ml = calculatePerpendicular(Go, Me, L6, L6, difference);
      const NlMl = calculateAngleBetweenFourNotConcernPoint(Me, Go, Sna, Snp);
      const MlOcP = findDotsMlOcP(is, ii, mm, Me, Go);
      const wits = findWits(A, B, is, ii, mm, difference);

      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["name"]: `L1-ML (Go-Me)`,
        },
        {
          [`value`]: SGo,
          ["key"]: "mm",
          ["name"]: `S - Go`,
        },
        {
          [`value`]: NGn,
          ["key"]: "mm",
          ["name"]: `N - Gn`,
        },
        {
          [`value`]: SnaGn,
          ["key"]: "mm",
          ["name"]: `Sna-Gn`,
        },
        {
          [`value`]: MLNSL,
          ["key"]: "deg",
          ["name"]: `ML/NSL`,
        },
        {
          [`value`]: NlMl,
          ["key"]: "deg",
          ["name"]: `NL/ML`,
        },
        {
          [`value`]: L1Ml,
          ["key"]: "mm",
          ["name"]: `L1/ML`,
        },
        {
          [`value`]: L6Ml,
          ["key"]: "mm",
          ["name"]: `L6/ML`,
        },
        {
          [`value`]: MlOcP,
          ["key"]: "deg",
          ["name"]: `Ml/OcP`,
        },
        {
          [`value`]: wits,
          ["key"]: "mm",
          ["name"]: `wits`,
        },
      ]);
      console.log(angle, "L1-ML (Go-Me)");
      console.log(SGo, "S - Go");
      console.log(NGn, "N - Gn");
      console.log(SnaGn, "Sna-Gn");
      console.log(MLNSL, "ML/NSL");
      console.log(NlMl, "NL/ML");
      console.log(L1Ml, "L1/ML");
      console.log(L6Ml, "L6/ML");
      console.log(MlOcP, "L6/ML");
      console.log(wits, "wits");
    }
    const indexIai = DOTS_INFO.findIndex(item => item.name === "iai") + 1;
    if (dots.some(item => item.dotName === "iai") && dots.length <= indexIai) {
      const is = dots.find(obj => obj.dotName === "is");
      const ias = dots.find(obj => obj.dotName === "ias");
      const ii = dots.find(obj => obj.dotName === "ii");
      const iai = dots.find(obj => obj.dotName === "iai");
      const angle = calculateAngleBetweenFourPoints(is, ias, ii, iai);

      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["name"]: `I-I (U1-L1)`,
        },
      ]);
      console.log(angle, "I-I (U1-L1)");
    }
    const indexIs = DOTS_INFO.findIndex(item => item.name === "is") + 1;
    if (dots.some(item => item.dotName === "is") && dots.length <= indexIs) {
      const N = dots.find(obj => obj.dotName === "N");
      const A = dots.find(obj => obj.dotName === "A");
      const is = dots.find(obj => obj.dotName === "is");
      const angle = calculateDistanceBetweenLineAndDot(N, A, is, difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "mm",
          ["name"]: `U1-NA`,
        },
      ]);
      console.log(angle, "U1-NA");
    }
    const indexIi = DOTS_INFO.findIndex(item => item.name === "ii") + 1;
    if (dots.some(item => item.dotName === "ii") && dots.length <= indexIi) {
      const dots1 = dots.find(obj => obj.dotName === "N");
      const dots2 = dots.find(obj => obj.dotName === "B");
      const dots3 = dots.find(obj => obj.dotName === "ii");
      const angle = calculateDistanceBetweenLineAndDot(
        dots1,
        dots2,
        dots3,
        distances[0].value
      );
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "mm",
          ["name"]: `L1-NB`,
        },
      ]);
      console.log(angle, "L1-NB");
    }
    const indexBa = DOTS_INFO.findIndex(item => item.name === "Ba") + 1;
    if (dots.some(item => item.dotName === "Ba") && dots.length <= indexBa) {
      const N = dots.find(obj => obj.dotName === "N");
      const S = dots.find(obj => obj.dotName === "S");
      const Ba = dots.find(obj => obj.dotName === "Ba");
      const angle = calculateAngleBetweenThreePoints(N, S, Ba, difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["name"]: `N/S/Ba`,
        },
      ]);
      console.log(angle, "N/S/Ba");
    }
    const indexAr = DOTS_INFO.findIndex(item => item.name === "Ar") + 1;
    if (dots.some(item => item.dotName === "Ar") && dots.length <= indexAr) {
      const N = dots.find(obj => obj.dotName === "N");
      const S = dots.find(obj => obj.dotName === "S");
      const Ar = dots.find(obj => obj.dotName === "Ar");
      const Go = dots.find(obj => obj.dotName === "Go");
      const Me = dots.find(obj => obj.dotName === "Me");
      const angle = calculateAngleBetweenThreePoints(N, S, Ar, difference);
      const ArGoMe = calculateAngleBetweenThreePoints(Me, Go, Ar, difference);
      const ArGo = calculateDistances(Go, Ar, difference);

      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["name"]: `N/S/Ar`,
        },
        {
          [`value`]: ArGoMe,
          ["key"]: "deg",
          ["name"]: `Ar-Go-Me “Go”`,
        },
        {
          [`value`]: ArGo,
          ["key"]: "deg",
          ["name"]: `Ar-Go`,
        },
      ]);
      console.log(angle, "N/S/Ar");
      console.log(ArGoMe, "Ar-Go-Me “Go”");
      console.log(ArGo, "Ar-Go");
    }
    const indexCo = DOTS_INFO.findIndex(item => item.name === "Co") + 1;
    if (dots.some(item => item.dotName === "Co") && dots.length <= indexCo) {
      const Co = dots.find(obj => obj.dotName === "Co");
      const Go = dots.find(obj => obj.dotName === "Go");
      const value = calculateDistances(Co, Go, difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: value,
          ["key"]: "mm",
          ["name"]: `Co-Go`,
        },
      ]);
      console.log(value, "Co-Go");
    }
    const indexPgPog = DOTS_INFO.findIndex(item => item.name === "pg=pog") + 1;
    if (
      dots.some(item => item.dotName === "pg=pog") &&
      dots.length <= indexPgPog
    ) {
      const pgPog = dots.find(obj => obj.dotName === "pg=pog");
      const gl = dots.find(obj => obj.dotName === "gl");
      const sn = dots.find(obj => obj.dotName === "sn");
      const glSnPg = calculateAngleBetweenThreePoints(
        gl,
        sn,
        pgPog,
        difference
      );
      setDistances(prev => [
        ...prev,
        {
          [`value`]: glSnPg,
          ["key"]: "deg",
          ["name"]: `gl-sn-pg`,
        },
      ]);
      console.log(glSnPg, "gl-sn-pg");
    }
    const indexSt = DOTS_INFO.findIndex(item => item.name === "me") + 1;
    if (dots.some(item => item.dotName === "me") && dots.length <= indexSt) {
      const st = dots.find(obj => obj.dotName === "st");
      const sn = dots.find(obj => obj.dotName === "sn");
      const me = dots.find(obj => obj.dotName === "me");
      const snSt = calculateDistances(st, sn, difference);
      const stMe = calculateDistances(st, me, difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: snSt,
          ["key"]: "mm",
          ["name"]: `sn-st`,
        },
        {
          [`value`]: stMe,
          ["key"]: "mm",
          ["name"]: `st-me`,
        },
      ]);
      console.log(snSt, "sn-st");
      console.log(stMe, "st-me");
    }
    const indexUL = DOTS_INFO.findIndex(item => item.name === "UL") + 1;
    if (dots.some(item => item.dotName === "UL") && dots.length <= indexUL) {
      const UL = dots.find(obj => obj.dotName === "UL");
      const col = dots.find(obj => obj.dotName === "col=pn");
      const sn = dots.find(obj => obj.dotName === "sn");
      const snSt = calculateAngleBetweenThreePoints(col, sn, UL, difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: snSt,
          ["key"]: "deg",
          ["name"]: `col-sn-UL`,
        },
      ]);
      console.log(snSt, "col-sn-UL");
    }
  }, [dots]);

  // useEffect(() => {
  //     const indexToDelete = distances.findIndex((item, index, array) => {
  //         return (
  //             array.findIndex((innerItem, innerIndex) => {
  //                 return innerItem.name === item.name && innerIndex < index;
  //             }) !== -1
  //         );
  //     });
  //
  //     if (indexToDelete !== -1) {
  //         setDistances(prev => prev.splice(indexToDelete, 1));
  //     }
  // }, [distances]);
  const navigate = useNavigate();
  const getTotal = () => {
    console.log(distances);
    const newArray = distances.slice(1);
    dispatch(setAddToLs(newArray));
    navigate(`/results/${patientInfo.id}`);
  };

  //отправка
  const handleFakeSubmit = () => {
    getTotal();
  };

  //Image filter
  const [invert, setInvert] = useState(false);
  const [rotate, setRotate] = useState(0);

  const [brightness, setBrightness] = useState(100);
  const [contast, setContrast] = useState(100);

  //zoom
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleWheel = e => {
    const delta = e.deltaY;
    const newScale = scale + delta / 1000;
    if (newScale >= 0.7 && newScale <= 3) {
      // ограничение масштаба
      setScale(newScale);
    }
  };
  const onClickZoomIn = () => {
    if (scale >= 0.8 && scale <= 3.1) {
      setScale(prev => prev + 0.1);
    }
  };
  const onClickZoomOut = () => {
    if (scale >= 0.8 && scale <= 3.1) {
      setScale(prev => prev - 0.1);
    }
  };

  const handleMouseDown = event => {
    event.preventDefault();

    if (event.button === 2) {
      setIsDragging(true);
      const startX = event.clientX;
      const startY = event.clientY;
      const startLeft = position.x;
      const startTop = position.y;
      const handleMouseMove = event => {
        event.preventDefault();
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        const left = startLeft + deltaX / scale;
        const top = startTop + deltaY / scale;
        setPosition({ x: left, y: top });
      };
      const handleMouseUp = event => {
        event.preventDefault();
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  return (
    <section style={{ overflow: "hidden", height: "100vh" }}>
      <div className={"container"}>
        <div className={style.parent}>
          <main className={style.main}>
            <div className={"breadcrumbs d-f"}>
              <h4>
                <Link to={"/"} className={"Link"}>
                  Главная
                </Link>
                /
                <Link to={"/Patients"} className={"Link"}>
                  Пациенты
                </Link>
                /<Link to={`/PatientCard/1`} className={"Link"}>{`fio`}</Link>
                /Боковая ТРГ
              </h4>
            </div>
            <div className={style.container}>
              <div className={style.block_1}>
                {/*<div className={style.title}>*/}
                {/*    <p>боковая трг</p>*/}
                {/*</div>*/}
                <div className={style.config}>
                  <div className={style.config_Item}>
                    <p>Ивертироват цвет</p>
                    <div>
                      <img
                        src={InvertOffSVG}
                        onClick={() => setInvert(prev => (prev = false))}
                      />
                      <img
                        src={InvertOnSVG}
                        onClick={() => setInvert(prev => (prev = true))}
                      />
                    </div>
                  </div>
                  <img src={DivideSVG} />
                  <div className={style.config_Item}>
                    <p>Свет</p>
                    <div>
                      <img src={BrightConfigSVG} onClick={handleClick} />
                    </div>
                    <Menu
                      id="fade-menu"
                      MenuListProps={{
                        "aria-labelledby": "fade-button",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      TransitionComponent={Fade}>
                      <div
                        className={style.div}
                        style={{
                          width: "186px",
                          height: "158px",
                          padding: "10px",
                          margin: "10px",
                        }}>
                        <p
                          style={{
                            fontStyle: "normal",
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "16px",
                            color: "#808080",
                          }}>
                          Яркость
                        </p>
                        <Slider
                          size="small"
                          max={200}
                          min={40}
                          defaultValue={100}
                          onChange={e => {
                            setBrightness(e.target.value);
                          }}
                          aria-label="Small"
                          valueLabelDisplay="auto"
                        />
                        <p
                          style={{
                            marginTop: "24px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "16px",
                            color: "#808080",
                          }}>
                          Контраст
                        </p>
                        <Slider
                          size="small"
                          max={200}
                          min={40}
                          defaultValue={100}
                          valueLabelDisplay="auto"
                          onChange={e => {
                            setContrast(e.target.value);
                          }}
                          aria-label="Small"
                        />
                      </div>
                    </Menu>
                  </div>
                  <img src={DivideSVG} />
                  <div className={style.config_Item}>
                    <p>Вращать</p>
                    <div>
                      <img
                        src={RotateLeftSVG}
                        onClick={() => setRotate(prev => prev - 90)}
                      />
                      <img
                        src={RotateRightSVG}
                        onClick={() => setRotate(prev => prev + 90)}
                      />
                    </div>
                  </div>
                  <img src={DivideSVG} />
                  <div className={style.config_Item}>
                    <p>Масштаб</p>
                    <div>
                      <img src={ZoomInSVG} onClick={onClickZoomIn} />
                      <img src={ZoomOutSVG} onClick={onClickZoomOut} />
                    </div>
                  </div>
                  <img src={DivideSVG} />
                  <div className={style.config_Item}>
                    <p>Убрать точки</p>
                    <div>
                      <img
                        src={PointslOffSVG}
                        onClick={handleToggleDotsVisibility}
                      />
                      <img
                        src={PointsOnSVG}
                        onClick={handleToggleDotsVisibilityTrue}
                      />
                    </div>
                  </div>
                  <img src={DivideSVG} />
                  <div className={style.config_Item}>
                    <p>Убрать линии</p>
                    <div>
                      <img
                        src={LinesOffSVG}
                        onClick={handleToggleLinesVisibility}
                      />
                      <img
                        src={LinesOnSVG}
                        onClick={handleToggleLinesVisibilityTrue}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.img}>
                  <div
                    className={style.size}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onContextMenu={e => e.preventDefault()}>
                    <div
                      style={{
                        height: "100vh",
                        cursor: `${isDragging ? "move" : "auto"}`,
                        transform: `scale(${scale}) rotate(${rotate}deg) translate(${position.x}px, ${position.y}px)`,
                        position: "relative",
                      }}>
                      <canvas
                        ref={canvasRef}
                        onClick={handleAddDot}
                        width={500}
                        height={500}
                      />
                      <img
                        id={"img"}
                        src={"https://prizma.ua/wp-content/uploads/trg_1-1.jpg"}
                        style={{
                          filter: `invert(${
                            invert ? "1" : "0"
                          }) brightness(${brightness}%) contrast(${contast}%)`,
                        }}
                      />
                      {isDotsVisible &&
                        dots?.map((item, index) => (
                          <h1
                            key={index}
                            style={{
                              fontSize: "10px",
                              color: "blue",
                              position: "absolute",
                              top: `${item.y - 20}px `,
                              left: `${item.x}px`,
                            }}>
                            {DOTS_INFO[index].name}
                          </h1>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.block_2}>
                <div className={style.pointsWrap}>
                  <img className={style.star1} src={star1} />
                  <img className={style.star2} src={star2} />
                  {DOTS_INFO.map((item, index) => (
                    <div className={style.block} key={index}>
                      <div className={style.dots_container}>
                        <p>{item.name}</p>
                        <div>
                          {index === dots.length - 1 && (
                            <img
                              src={deleteSVG}
                              onClick={() => removeDot(index, item.name)}
                            />
                          )}
                          {index > dots.length - 1 ? (
                            <img src={loadingSVG} />
                          ) : (
                            <img src={DoneSVG} />
                          )}
                        </div>
                      </div>
                      <div className={style.hint}>
                        {index === dots.length && (
                          <img
                            src={item.img}
                            onClick={() => removeDot(index)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={style.btn} onClick={() => handleFakeSubmit()}>
                  <svg
                    width="82"
                    height="39"
                    viewBox="0 0 82 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3.07959 27.6785L28.9621 34.6322L32.2816 20.1894L45.7201 3.60913L78.5699 14.8418"
                      stroke="white"
                      strokeMiterlimit="22.9256"
                    />
                    <path
                      d="M32.5274 17.5496C34.024 17.5496 35.2959 18.8629 35.2959 20.5619C35.2959 22.261 34.024 23.5743 32.5274 23.5743C31.0325 23.5743 29.7588 22.2608 29.7588 20.5619C29.7588 18.8649 31.0326 17.5496 32.5274 17.5496Z"
                      fill="#0093D3"
                      stroke="white"
                    />
                    <path
                      d="M3.26856 24.7202C4.76328 24.7202 6.03713 26.0355 6.03713 27.7326C6.03713 29.4314 4.76347 30.7449 3.26856 30.7449C1.77366 30.7449 0.5 29.4314 0.5 27.7326C0.5 26.0355 1.77384 24.7202 3.26856 24.7202Z"
                      fill="#0093D3"
                      stroke="white"
                    />
                    <path
                      d="M28.9375 31.8916C30.4322 31.8916 31.7061 33.2069 31.7061 34.904C31.7061 36.6012 30.4339 37.9163 28.9375 37.9163C27.4411 37.9163 26.1689 36.6012 26.1689 34.904C26.1689 33.2067 27.4411 31.8916 28.9375 31.8916Z"
                      fill="#0093D3"
                      stroke="white"
                    />
                    <path
                      d="M45.877 1C47.3719 1 48.6455 2.3135 48.6455 4.01236C48.6455 5.71123 47.3719 7.02471 45.877 7.02471C44.3821 7.02471 43.1084 5.71123 43.1084 4.01236C43.1084 2.31533 44.3822 1 45.877 1Z"
                      fill="#0093D3"
                      stroke="white"
                    />
                    <path
                      d="M78.7315 11.7576C80.2281 11.7576 81.5 13.0709 81.5 14.7699C81.5 16.4671 80.2279 17.7823 78.7315 17.7823C77.2366 17.7823 75.9629 16.4688 75.9629 14.7699C75.9629 13.0711 77.2366 11.7576 78.7315 11.7576Z"
                      fill="#0093D3"
                      stroke="white"
                    />
                  </svg>
                  <div className={style.btnTextWrap}>
                    <div className={style.btnTitle}>расчитать трг</div>
                    <div className={style.btnText}>боковой проекции</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className={style.error}>
        Расчет можно редактировато только на ПК версии с разрешением от 1000px
        по ширине
      </div>
    </section>
  );
};

export default Diagnostic;
