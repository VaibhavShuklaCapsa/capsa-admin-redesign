import Image from "next/image";
import React from "react";

const DisplayCard = ({
  title,
  subTitle,
  icon,
  color,
  borderColor,
  iconBg,
  subText,
  subTextIcon,
}) => {
  return (
    <div
      // key={key}
      className={`${color ? `${color}` : "bg-[#fff]"} border ${
        color ? `${borderColor}` : "border-borderGrey"
      } rounded-xl p-4 flex flex-col gap-4 py-8 h-full`}
    >
      <div className={`${iconBg ? `${iconBg} p-3 max-w-fit rounded-xl` : ""}`}>
        <Image src={icon} width={20} height={20} alt={icon} />
      </div>
      <div>
        <p
          className={`${subText ? "text-white" : "text-grey"} text-sm md:text-base mb-4 font-medium`}
        >
          {title}
        </p>

       {subText &&  <p className="text-backgroundBlue font-bold my-4 text-sm md:text-base">
          {subText}
        </p>}
        
        <h4 className={`font-bold text-base lg:text-xl ${subText ? "text-white flex gap-2 items-center" : ""}`}>
          {subTitle}
          {subTextIcon && <Image src={subTextIcon} width={20} height={20} alt="icon"/>}
        </h4>
      </div>
    </div>
  );
};

export default DisplayCard;
