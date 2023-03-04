import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../Diagnostic/index.module.scss";

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
import { setAddToLs } from "../../Slices/TrgSlice";
import { DOTS_INFO } from "./dotsInfoArr";
import {
  calculateAngleBetweenFourPoints,
  calculateAngleBetweenThreePoints,
  calculateAngleToTheIntersection,
  calculateDistanceBetweenLineAndDot,
  calculateDistances,
  calculatePerpendicular,
} from "./calculateFunctions/calculateFunctions";

const Diagnostic = () => {
  const fileUrl = useSelector(state => state.trg.fileUrl);

  //Canvas Logic

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [dots, setDots] = useState([]);
  const [dotsId, setDotsId] = useState(1);

  const [isDotsVisible, setIsDotsVisible] = useState(true);
  const [isLinesVisible, setIsLinesVisible] = useState(true);

  //Здесь будут храниться обьекты [{"a-b":точка А - точка B},{"a-b":точка С - точка D }...] =>пока без расстояния
  const [dotsMM, setDotsMM] = useState([]);

  const dispatch = useDispatch();

  const [currentDocumentWidth, setCurrentDocumentWidth] = useState(
    document.documentElement.clientWidth || document.body.clientWidth
  );

  const [currentDotDiameter, setCurrentDotDiameter] = useState(4);

  useEffect(() => {
    setCurrentDocumentWidth(
      document.documentElement.clientWidth || document.body.clientWidth
    );
    if (currentDocumentWidth <= 768 && currentDocumentWidth > 375) {
      setCurrentDotDiameter(3);
    }
    if (currentDocumentWidth <= 375) {
      setCurrentDotDiameter(2);
    }
    if (currentDocumentWidth > 768) {
      setCurrentDotDiameter(4);
    }
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

      // //Показать линии
      if (index > 0 && isLinesVisible) {
        //   if (index % 2 !== 0) {
        //     //Для того , чтобы линия была только между двумя точками
        //     // contextRef.current.moveTo(dots[index - 1].x, dots[index - 1].y);
        //     // contextRef.current.lineTo(dot.x, dot.y);
        drawLineBetweenThreePoints();
      }

      // }
    });
  }, [dots, isDotsVisible, isLinesVisible]);

  function handleAddDot(event) {
    if (dots.length < DOTS_INFO.length) {
      const canvas = canvasRef.current;
      setDotsId(prev => prev + 1);
      const rect = canvas.parentNode.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
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
  function removeDot(index) {
    if (dots.length > 0 && distances.length > 0) {
      setDots(prev => (prev = dots.slice(0, dots.length - 1)));
    }
    if (dots.length !== DOTS_INFO.flat().length - 1) {
      setIsButton(false);
    }
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

  const [lineCords, setLineCords] = useState([]);

  //Все работает, только код длинный.Каждый if внутри первого if  - это  новая линия м/у точками

  function drawLineBetweenThreePoints() {
    contextRef.current.strokeStyle = "red";

    if (lineCords.length) {
      if (lineCords.flat().some(item => item.dotName === "B")) {
        //обрещание к первому массиву [[0],[]]
        contextRef.current.moveTo(lineCords[0][0].x, lineCords[0][0].y);
        contextRef.current.lineTo(lineCords[0][1].x, lineCords[0][1].y);
        contextRef.current.lineTo(lineCords[0][2].x, lineCords[0][2].y);
        contextRef.current.stroke();
      }
      if (lineCords.flat().some(item => item.dotName === "is")) {
        //обрещание к второму массиву [[],[1],....]
        contextRef.current.moveTo(lineCords[1][0].x, lineCords[1][0].y);
        contextRef.current.lineTo(lineCords[1][1].x, lineCords[1][1].y);
        contextRef.current.lineTo(lineCords[1][2].x, lineCords[1][2].y);
        contextRef.current.stroke();
      }
      //при необходимости добавить  еще линий => lineCords[индекс массива][индекс объекта]
    }
    // console.log(lineCords); => [[{S},{N},{B}],[{S},{N},{is}]]
  }

  useEffect(() => {
    // тут проводится проверка на то есть ли обьекты в массиве дистанций
    if (
      distances.some(dis => typeof dis === "object" && dis !== null) &&
      distances[0].value !== 30
    ) {
      //берется первый обьект, он должен быть первыми точками которые служал для определение нашим мм и тех что на картинки
      //значени 30 это значение которое должен выбрать пользователь на линейке для праильного понимая системой картинки
      const newDifference =
        ((30 - distances[0].value) / distances[0].value) * 100;
      //все преобразовал в проценты, это проценты разницы между картинкой и нашими мм для корректного отображения на всех разрешениях экрана
      setDifference(newDifference);
    }

    //условия для выполнения формул
    if (dots.some(item => item.dotName === "secondDot") && dots.length <= 2) {
      const value = calculateDistances(dots[0], dots[1], difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: value,
          ["key"]: "mm",
          ["a-b"]: `${dots[0].dotName} - ${dots[1].dotName}`,
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
          ["a-b"]: `SNA`,
        },
      ]);

      console.log(angle, "SNA");
    }
    const indexB = DOTS_INFO.findIndex(item => item.name === "B") + 1;
    if (dots.some(item => item.dotName === "B") && dots.length <= indexB) {
      const dots1 = dots.find(obj => obj.dotName === "S");
      const dots2 = dots.find(obj => obj.dotName === "N");
      const dots3 = dots.find(obj => obj.dotName === "B");
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
          ["a-b"]: `SNB`,
        },
      ]);
      console.log(angle, "SNB");

      //новый массив для пуша в lineCords
      let arr = [];
      arr.push(dots1, dots2, dots3);
      setLineCords([arr]);
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
      const PgGo = PgGn + GnMe + MeGo;
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["a-b"]: `SNPg`,
        },
        {
          [`value`]: PgGo,
          ["key"]: "mm",
          ["a-b"]: `Pg’-Go`,
        },
      ]);
      console.log(angle, "SNPg");
      console.log(PgGo, "Pg’-Go");
      console.log(angle2, "Pg-NB");
    }
    const indexIas = DOTS_INFO.findIndex(item => item.name === "ias") + 1;
    if (dots.some(item => item.dotName === "ias") && dots.length <= indexIas) {
      const dots1 = dots.find(obj => obj.dotName === "S");
      const dots2 = dots.find(obj => obj.dotName === "N");
      const dots3 = dots.find(obj => obj.dotName === "is");
      const dots4 = dots.find(obj => obj.dotName === "ias");
      const angle = calculateAngleBetweenFourPoints(dots1, dots2, dots3, dots4);
      const value = calculateDistances(dots1, dots2, difference);

      //новый массив для пуша в lineCords
      let arr = [];
      arr.push(dots1, dots2, dots3);
      setLineCords(prev => [...prev, arr]);

      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["a-b"]: `U1-NSL (SN)`,
        },
        {
          [`value`]: value,
          ["key"]: "mm",
          ["a-b"]: `N-S`,
        },
      ]);
      console.log(angle, "U1-NSL (SN)");
      console.log(value, "N-S");
    }
    const indexSnp = DOTS_INFO.findIndex(item => item.name === "Snp") + 1;
    if (dots.some(item => item.dotName === "Snp") && dots.length <= indexSnp) {
      const is = dots.find(obj => obj.dotName === "is");
      const ias = dots.find(obj => obj.dotName === "ias");
      const Snp = dots.find(obj => obj.dotName === "Snp");
      const Sna = dots.find(obj => obj.dotName === "Sna");
      const dots5 = dots.find(obj => obj.dotName === "A");
      const angle = calculateAngleBetweenFourPoints(is, ias, Snp, Sna);
      const value = calculateAngleToTheIntersection(
        Sna,
        Snp,
        dots5,
        difference
      );
      const value2 = calculatePerpendicular(Snp, Sna, ias, is, difference);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["a-b"]: `U1-NL (SNA-SNP)`,
        },
        {
          [`value`]: value,
          ["key"]: "mm",
          ["a-b"]: `A1-SNP`,
        },
        {
          [`value`]: value2,
          ["key"]: "mm",
          ["a-b"]: `U1-NL`,
        },
      ]);
      console.log(angle, "U1-NL (SNA-SNP)");
      console.log(value2, "U1-NL");
      console.log(value, "A1-SNP");
    }
    const indexMe = DOTS_INFO.findIndex(item => item.name === "Me") + 1;
    if (dots.some(item => item.dotName === "Me") && dots.length <= indexMe) {
      const dots1 = dots.find(obj => obj.dotName === "ias");
      const dots2 = dots.find(obj => obj.dotName === "ii");
      const dots3 = dots.find(obj => obj.dotName === "Go");
      const Me = dots.find(obj => obj.dotName === "Me");
      const angle = calculateAngleBetweenFourPoints(dots1, dots2, Me, dots3);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["a-b"]: `U1-NL (SNA-SNP)`,
        },
      ]);
      console.log(angle, "L1-ML (Go-Me)");
    }
    const indexIai = DOTS_INFO.findIndex(item => item.name === "iai") + 1;
    if (dots.some(item => item.dotName === "iai") && dots.length <= indexIai) {
      const dots1 = dots.find(obj => obj.dotName === "is");
      const dots2 = dots.find(obj => obj.dotName === "ias");
      const dots3 = dots.find(obj => obj.dotName === "iai");
      const dots4 = dots.find(obj => obj.dotName === "ii");
      const angle = calculateAngleBetweenFourPoints(dots1, dots2, dots4, dots3);
      setDistances(prev => [
        ...prev,
        {
          [`value`]: angle,
          ["key"]: "deg",
          ["a-b"]: `U1-NL (SNA-SNP)`,
        },
      ]);
      console.log(angle, "I-I (U1-L1)");
    }
    const indexIs = DOTS_INFO.findIndex(item => item.name === "is") + 1;
    if (dots.some(item => item.dotName === "is") && dots.length <= indexIs) {
      const dots1 = dots.find(obj => obj.dotName === "N");
      const dots2 = dots.find(obj => obj.dotName === "A");
      const dots3 = dots.find(obj => obj.dotName === "is");
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
          ["a-b"]: `U1-NA`,
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
          ["a-b"]: `L1-NB`,
        },
      ]);
      console.log(angle, "L1-NB");
    }
    const indexBa = DOTS_INFO.findIndex(item => item.name === "Ba") + 1;
    if (dots.some(item => item.dotName === "Ba") && dots.length <= indexBa) {
      const dots1 = dots.find(obj => obj.dotName === "N");
      const dots2 = dots.find(obj => obj.dotName === "S");
      const dots3 = dots.find(obj => obj.dotName === "Ba");
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
          ["a-b"]: `N/S/Ba`,
        },
      ]);
      console.log(angle, "N/S/Ba");
    }
    const indexAr = DOTS_INFO.findIndex(item => item.name === "Ar") + 1;
    if (dots.some(item => item.dotName === "Ar") && dots.length <= indexAr) {
      const dots1 = dots.find(obj => obj.dotName === "N");
      const dots2 = dots.find(obj => obj.dotName === "S");
      const dots3 = dots.find(obj => obj.dotName === "Ar");
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
          ["a-b"]: `N/S/Ar`,
        },
      ]);
      console.log(angle, "N/S/Ar");
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
          ["a-b"]: `Co-Go`,
        },
      ]);
      console.log(value, "Co-Go");
    }
  }, [dots]);

  const getTotal = () => {
    const combinedArray = [];

    //dotsMM меняю уже на правельный массив  combinedArray , теперь сдесь рассчет дистанции в mm
    // console.log(distances, "DISTANCE");
    // console.log(dots, "DOTS");

    setDotsMM(combinedArray);
    //имитация отправки на бэк
    dispatch(setAddToLs(combinedArray));
  };

  //отправка
  const handleFakeSubmit = () => {
    getTotal();
    // if (dotsMM.length && dots.length > 0) {
    //     setDots([]);
    //     setDotsMM([]);
    //
    // }
  };

  //Image filter

  const [invert, setInvert] = useState(false);
  const [rotate, setRotate] = useState(0);

  const [brightness, setBrightness] = useState(100);
  const [contast, setContrast] = useState(100);
  return (
    <div className={"container"}>
      <div className={style.parent}>
        <main className={style.main}>
          <div className={style.breadcrumb}>
            <p>
              Главная/Пациенты/Все пациенты/Иванов Иван Иванович/Боковая ТРГ
            </p>
          </div>
          <div className={style.container}>
            <div className={style.block_1}>
              <div className={style.title}>
                <p>боковая трг</p>
              </div>
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
                    <img src={ZoomInSVG} />
                    <img src={ZoomOutSVG} />
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
                <canvas ref={canvasRef} onMouseDown={handleAddDot} />
                <img
                  src={
                    fileUrl
                      ? fileUrl
                      : "https://prizma.ua/wp-content/uploads/trg_1-1.jpg"
                  }
                  style={{
                    filter: `invert(${
                      invert ? "1" : "0"
                    })   brightness(${brightness}%) contrast(${contast}%)`,
                    transform: `rotate(${rotate}deg)  `,
                  }}
                />
                {isDotsVisible &&
                  dots?.map((item, index) => (
                    <h1
                      style={{
                        fontSize: "10px",
                        color: "blue",
                        position: "absolute",
                        top: `${item.y - 20}px `,
                        left: `${item.x}px`,
                      }}>
                      {DOTS_INFO.flat()[index].name}
                    </h1>
                  ))}
              </div>
            </div>
            <div className={style.block_2}>
              <img className={style.star1} src={star1} />
              <img className={style.star2} src={star2} />
              {DOTS_INFO.flat().map((item, index) => (
                <div className={style.block} key={index}>
                  <div className={style.dots_container}>
                    <p>{item.name}</p>
                    <div>
                      {index === dots.length - 1 && (
                        <img src={deleteSVG} onClick={() => removeDot(index)} />
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
                      <img src={item.img} onClick={() => removeDot(index)} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={style.button_div}>
            <button
              onClick={() => handleFakeSubmit()}
              // disabled={isButton ? false : true}
              style={
                isButton
                  ? { border: "5px solid green" }
                  : { border: "5px solid red" }
              }>
              GET
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Diagnostic;
