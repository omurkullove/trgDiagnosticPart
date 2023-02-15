import React from "react";
import style from "./index.module.scss";

//Assets
import Krestik from "./Assets/Group 30.svg";
import ImgBox from "./Assets/Img_box.svg";
import { useState } from "react";
import Refresh from "./Assets/Refresh__2.svg";
import Trash from "./Assets/Trash.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setGetFileUrl } from "../../Slices/TrgSlice";

import star1 from "./Assets/star1.svg";
import star2 from "./Assets/star2.svg";

const TagFile = () => {
  const [img, setImg] = useState("");
  const [imgUrl, setImgUrl] = useState();

  const fileReader = new FileReader();

  fileReader.onloadend = () => {
    setImgUrl(fileReader.result);
  };

  const handleRead = e => {
    e.preventDefault();
    const file = e.target.files[0];
    setImgUrl(file);
    fileReader.readAsDataURL(file);
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleFile = () => {
    dispatch(setGetFileUrl(imgUrl));
    navigate("/trg-diagnostic");
  };

  return (
    <div className={style.modal_parent}>
      <div className={style.modal_container}>
        <img src={star1} className={style.star1} />
        <div className={style.modal_header}>
          <img src={Krestik} />
        </div>
        <div className={style.modal_title}>
          <p className={style.title_text}>Боковой снимок ТРГ</p>
        </div>
        <div className={style.modal_content}>
          <div className={style.content_imgBox_container}>
            {imgUrl && imgUrl ? (
              <img className={style.imgboxCUSTOM} src={imgUrl} />
            ) : (
              <img src={ImgBox} className={style.imgbox} />
            )}
          </div>
          <div className={style.content_button_conntainer}>
            {imgUrl && imgUrl ? (
              <div>
                <div>
                  <form className={style.modal_form_edit}>
                    <label className={style.modal_lable_edit}>
                      <img src={Refresh} className={style.modal_edit_img} />
                      <p className="">Выбрать другой</p>
                      <input
                        className={style.content_input_edit}
                        placeholder="добавить снимок"
                        type="file"
                        onChange={handleRead}
                      />
                    </label>
                  </form>
                </div>
                <div className={style.modal_delete_container}>
                  <img src={Trash} className={style.modal_delete_img} />
                  <button
                    className={style.modal_delete_button}
                    onClick={() => setImgUrl()}>
                    Удалить
                  </button>
                </div>
              </div>
            ) : (
              <>
                <form className={style.modal_form}>
                  <label className={style.modal_lable}>
                    <p className={style.modal_p}>добавить снимок</p>
                    <input
                      className={style.content_input}
                      placeholder="добавить снимок"
                      type="file"
                      onChange={handleRead}
                    />
                  </label>
                </form>
                <p className={style.content_text}>
                  Изображение в формате JPEG, JPG, PNG, или BMP Максимальный
                  размер 20 МБ.
                </p>
              </>
            )}
          </div>
        </div>
        <div className={style.modal_button_container}>
          <button
            className={style.modal_button}
            disabled={imgUrl && imgUrl ? false : true}
            style={{
              backgroundColor: `${imgUrl ? " #0093D3" : "white"}`,
              color: `${imgUrl ? "white" : "lightGray"}`,
            }}
            onClick={handleFile}>
            добавить расчёт
          </button>
        </div>
        <img src={star2} className={style.star2} />
      </div>
    </div>
  );
};

export default TagFile;

// <div className=" w-full   ml-6">
//             <form className="flex">
//               <div className="w-52 h-80 flex justify-center border-2 rounded-lg border-dashed border-ourOrange  bg-gradient-to-r from-gray1ForGradient to-gray2ForGradient ">
//                 <label className=" w-full h-full flex flex-col justify-between items-center cursor-pointer  ">
//                   {imgURL && imgURL ? (
//                     <img src={imgURL} className="w-full h-full rounded-lg" />
//                   ) : (
//                     <img
//                       src={AddImg}
//                       className="w-3 h-3 cursor-pointer mt-36 "
//                     />
//                   )}

//                   {imgURL ? null : (
//                     <span className="text-ourBlue font-semibold text-base mb-9">
//                       Выбрать обложку
//                     </span>
//                   )}

//                   <TextField
//                     type="file"
//                     className="w-1/2 h-full input "
//                     name=""
//                     onChange={handlerSubmit}
//                   />
//                 </label>
//               </div>
