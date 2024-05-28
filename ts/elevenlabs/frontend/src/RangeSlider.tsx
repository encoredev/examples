import { FC } from "react";

const RangeSlider: FC<{
  title: string;
  minDesc: string;
  maxDesc: string;
  min: number;
  max: number;
  value: number;
  setValue: (val: number) => void;
}> = ({ title, minDesc, maxDesc, min, max, value, setValue }) => {
  return (
    <div className="flex flex-col text-left space-y-1 w-[250px]">
      <label htmlFor={title}>{title}</label>
      <div className="w-full flex justify-between text-xs opacity-50">
        <span>{minDesc}</span>
        <span>{maxDesc}</span>
      </div>
      <input
        id={title}
        className="w-full range accent-black"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => setValue(parseInt(event.target.value))}
      />
    </div>
  );
};

export default RangeSlider;
