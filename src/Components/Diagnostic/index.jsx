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
        contextRef.current.arc(dot.x, dot.y, 4, 0, 2 * Math.PI);
        contextRef.current.fill();
      }

      //Показать линии
      if (index > 0 && isLinesVisible) {
        contextRef.current.beginPath();
        contextRef.current.moveTo(dots[index - 1].x, dots[index - 1].y);
        contextRef.current.lineTo(dot.x, dot.y);
        contextRef.current.strokeStyle = "red";
        contextRef.current.stroke();
      }
    });
  }, [dots, isDotsVisible, isLinesVisible]);

  function handleAddDot(event) {
    if (dots.length < DOTS_INFO.flat().length) {
      const canvas = canvasRef.current;
      setDotsId(prev => prev + 2);
      const rect = canvas.parentNode.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setDots(prev => [...dots, { x, y, dotsId }]);
      //функция динамически трансформирует массив  вывод и есть dotsMM
      transformArray(dots);
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
    if (dots.length > 0) {
      setDots(prev => (prev = dots.slice(0, dots.length - 1)));
    }
    if (dots.length !== DOTS_INFO.flat().length - 1) {
      setIsButton(false);
    }
  }

  //Здесь должны храниться все чтоки с назканиями  [[{a},b],[{c},{d}] и т.д] // ключ img для подсказки

  const DOTS_INFO = [
    [
      {
        name: "A",
        img: "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg?quality=85&w=1024&h=628&crop=1",
      },
      {
        name: "B",
        img: "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg?quality=85&w=1024&h=628&crop=1",
      },
    ],
    [
      {
        name: "C",
        img: "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg?quality=85&w=1024&h=628&crop=1",
      },
      {
        name: "D",
        img: "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg?quality=85&w=1024&h=628&crop=1",
      },
    ],
    [
      {
        name: "E",
        img: "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg?quality=85&w=1024&h=628&crop=1",
      },
      {
        name: "F",
        img: "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg?quality=85&w=1024&h=628&crop=1",
      },
    ],
    [
      {
        name: "G",
        img: "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg?quality=85&w=1024&h=628&crop=1",
      },
      {
        name: "H",
        img: "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg?quality=85&w=1024&h=628&crop=1",
      },
    ],
  ];

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

  // Как я говорил выше , функция меняет массив  DOTS_INFO
  function transformArray(dots) {
    const transformedArray = DOTS_INFO.map(innerArr => {
      const nameValues = innerArr.reduce((acc, obj, index) => {
        const [key, value] = Object.entries(obj)[0];
        acc[`name${index + 1}`] = value;
        return acc;
      }, {});
      return {
        "a-b": `${nameValues.name1}-${nameValues.name2}`,
      };
    });

    // В res , уже измененный массив
    const res = returnObjectsEverySecond(transformedArray, dots);

    const data = [];
    for (let i = 0; i < res.length; i++) {
      data.push(res[i]);
    }
    //Проверка для того , чтобы  dotsMM правельно и динамично изменяелся на data , dotsMM === data === res
    if (
      data.length === DOTS_INFO.length &&
      dots.length === DOTS_INFO.flat().length - 1
    ) {
      setDotsMM(prev => (prev = data));
      setIsButton(true);
    }
  }
  //Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1),2)) => формула для вичисляения расстояния между точками А и Б в расстоянии

  //Эта функция связана с transformArray  , он принемает 2 массива . Первый измененный массив после transformArray , а второй массив с точками dots
  //Во-первых эта функция нужна для того , чтобы  соеденять  каждый четный обьект с пред. [1,2,3,4,5,6] =>[3,7,11]
  function returnObjectsEverySecond(arr1, arr2) {
    let i = 0;
    let j = 0;
    const outputArray = [];
    while (i < arr1.length && j < arr2.length) {
      if (j % 2 === 0) {
        outputArray.push(arr1[i]);
        i++;
      }
      j++;
    }
    return outputArray;
  }

  //Логика просчета дистанции
  const [distances, setDistances] = useState([]);

  //Разница между нашими мм и теми что на картинке
  const [difference, setDifference] = useState(0);

  //чем то эта фунция сортирует  координаты для фунции distance
  function calculateDistances() {
    const newDistances = [];
    for (let i = 0; i < dots.length - 1; i += 2) {
      const dist = (distance(dots[i].x, dots[i].y, dots[i + 1].x, dots[i + 1].y));
      //происводится подсчет dist учитывая разницу между растоянием
      let distWithDifference = dist + (dist * Math.abs(difference) / 100) * (difference > 0 ? 1 : -1);
      // В дист храниться обькт уже с рассчитаной дистнацикей  {key:"distance"},теперь остается все запушить
      newDistances.push({ [`key`]: distWithDifference });
    }
    //Меняем стейт
    setDistances(newDistances);
  }

  //Рассчет дистанции по формуле , которую я упомянул выше
  function distance(x1, y1, x2, y2) {
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) / 3.8; // 1mm = 3.8px
  }

  //Этот effect , для того чтобы фунция calculateDistances работала автоматически после каждого твороего нажатия
  useEffect(() => {
    if (dots.length % 2 === 0) {
      calculateDistances();
    }
  }, [dots]);

  useEffect(() => {
    // тут проводится проверка на то есть ли обьекты в массиве дистанций
    if (distances.some(dis => typeof dis === 'object' && dis !== null)){
      //берется первый обьект, он должен быть первыми точками которые служал для определение нашим мм и тех что на картинки
      //значени 30 это значение которое должен выбрать пользователь на линейке для праильного понимая системой картинки
      const newDifference = ((30 - distances[0].key) / distances[0].key * 100)
      //все преобразовал в проценты, это проценты разницы между картинкой и нашими мм для корректного отображения на всех разрешениях экрана
      setDifference(newDifference)
    }
  }, [distances])

  /*  
  Теперь у нас есть два массива dotsMM и distances

  dotsMM => [{"a-b":"A-B"},{"a-b":"C-D"}...] =>пока без ключа key
  distances =>[{key:"some distance"},{key:"some distance"}...]

  Функция getTotal просто комбинирует два массива  , сливая в один массив  (мержит)  , 
  вывод в итоге такой в  combinedArray => [{"a-b":"A-B" , key:"distance"},{"a-b":"C-D" , key:"distance"}...]
  
  */
  const getTotal = () => {
    const combinedArray = [];
    for (let i = 0; i < dotsMM.length; i++) {
      const obj = { ...dotsMM[i], ...distances[i] };
      combinedArray.push(obj);
    }
    //dotsMM меняю уже на правельный массив  combinedArray , теперь сдесь рассчет дистанции в mm
    console.log(combinedArray);
    setDotsMM(combinedArray);
    //имитация отправки на бэк
    dispatch(setAddToLs(combinedArray));
  };

  //отправка
  const handleFakeSubmit = () => {
    getTotal();
    if (dotsMM.length && dots.length > 0) {
      setDots([]);
      setDotsMM([]);
      setDifference(0)
    }
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
                      : "https://tools.kz/wp-content/uploads/2022/09/%D0%9B%D0%B8%D0%BD%D0%B5%D0%B9%D0%BA%D0%B0-%D0%BC%D0%B5%D1%82%D0%B0%D0%BB%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F-%D0%B8%D0%B7%D0%BC%D0%B5%D1%80%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F-150-%D0%BC%D0%BC-%D0%A7%D0%98%D0%97.jpg"
                  }
                  style={{
                    filter: `invert(${
                      invert ? "1" : "0"
                    })   brightness(${brightness}%) contrast(${contast}%)`,
                    transform: `rotate(${rotate}deg)  `,
                  }}
                />
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
              disabled={isButton ? false : true}
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
