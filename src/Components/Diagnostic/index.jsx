import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
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
import {Fade, Menu} from "@mui/material";
import Slider from "@mui/material/Slider";
import star1 from "../TagFile/Assets/star1.svg";
import star2 from "../TagFile/Assets/star2.svg";

import loadingSVG from "./Assets/loading.svg";
import DoneSVG from "./Assets/Done.svg";
import deleteSVG from "./Assets/delete.svg";

const Diagnostic = () => {



    const fileUrl = useSelector(state => state.trg.fileUrl);

    //Canvas Logic

    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [dots, setDots] = useState([]);
    const [dotsId, setDotsId] = useState(1);
    const [isDotsVisible, setIsDotsVisible] = useState(true);
    const [isLinesVisible, setIsLinesVisible] = useState(true);

    const [index, setIndex] = useState(0);
    const [index2, setIndex2] = useState(0);

    const [dotsMM, setDotsMM] = useState([]);

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

        dots.forEach((dot, index) => {
            if (isDotsVisible) {
                contextRef.current.fillStyle = "red";
                contextRef.current.beginPath();
                contextRef.current.arc(dot.x, dot.y, 4, 0, 2 * Math.PI);
                contextRef.current.fill();
            }

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
            setDots(prev => [...dots, {x, y, dotsId}]);
            setIndex(index + 1);
            setIndex2(index2 + 1);
            transformArray(dots);
        } else {
            return;
        }
    }

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

    function removeDot(index) {
        if (dots.length > 0) {
            setDots(prev => (prev = dots.slice(0, dots.length - 1)));
        }
    }

    //DOTS INFO

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

    function transformArray(dots) {
        const transformedArray = DOTS_INFO.map(innerArr => {
            const nameValues = innerArr.reduce((acc, obj, index) => {
                const [key, value] = Object.entries(obj)[0];
                acc[`name${index + 1}`] = value;
                return acc;
            }, {});
            return {"a-b": `${nameValues.name1}-${nameValues.name2}`};
        });
        const res = returnObjectsEverySecond(transformedArray, dots);
        const data = [];
        for (let i = 0; i < res.length; i++) {
            data.push(res[i]);
        }
        if (data.length === DOTS_INFO.length) {
            setDotsMM(prev => (prev = data));
            setIsButton(true);
        }
    }

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

    const handleFakeSubmit = () => {
        console.log("submitted!");
        console.log(dotsMM);
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
                        <p>Главная/Пациенты/Все пациенты/Иванов Иван Иванович/Боковая ТРГ</p>
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
                                <img src={DivideSVG}/>
                                <div className={style.config_Item}>
                                    <p>Свет</p>
                                    <div>
                                        <img src={BrightConfigSVG} onClick={handleClick}/>
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
                                <img src={DivideSVG}/>
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
                                <img src={DivideSVG}/>
                                <div className={style.config_Item}>
                                    <p>Масштаб</p>
                                    <div>
                                        <img src={ZoomInSVG}/>
                                        <img src={ZoomOutSVG}/>
                                    </div>
                                </div>
                                <img src={DivideSVG}/>
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
                                <img src={DivideSVG}/>
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
                                <canvas ref={canvasRef} onMouseDown={handleAddDot}/>
                                <img
                                    src={
                                        fileUrl
                                            ? fileUrl
                                            : "https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg"
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
                            <img className={style.star1} src={star1}/>
                            <img className={style.star2} src={star2}/>
                            {DOTS_INFO.map((item, index) => (
                                <div className={style.block} key={index}>
                                    <div className={style.dots_container}>
                                        <p>{item.name}</p>
                                        <div>
                                            {index === dots.length - 1 && (
                                                <img src={deleteSVG} onClick={() => removeDot(index)}/>
                                            )}
                                            {index > dots.length - 1 ? (
                                                <img src={loadingSVG}/>
                                            ) : (
                                                <img src={DoneSVG}/>
                                            )}
                                        </div>
                                    </div>
                                    <div className={style.hint}>
                                        {index === dots.length && (
                                            <img src={item.img} onClick={() => removeDot(index)}/>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={style.button_div}>
                        <button
                            onClick={handleFakeSubmit}
                            disabled={isButton ? false : true}
                            style={
                                isButton
                                    ? {border: "5px solid green"}
                                    : {border: "5px solid red"}
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
