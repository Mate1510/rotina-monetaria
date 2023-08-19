import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  useState,
  ChangeEvent,
} from "react";
import { twMerge } from "tailwind-merge";

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  children: ReactNode;
}

function Select({
  className,
  error,
  errorMessage,
  placeholder,
  children,
  ...props
}: SelectProps) {
  const [selected, setSelected] = useState("");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelected(event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  const selectClassName = twMerge(
    "rounded-lg border border-gray-300 bg-white p-2 text-sm font-normal text-constrastBlack placeholder-black placeholder-opacity-40 outline-none transition-all focus:ring-1 focus:ring-primaryOrange",
    error ? "border-red-500" : "",
    selected ? "text-opacity-100" : "text-opacity-40",
    className
  );

  return (
    <div className="flex w-full flex-col">
      <select
        className={selectClassName}
        {...props}
        value={selected}
        onChange={handleChange}
      >
        {placeholder && (
          <option value="" disabled className="text-opacity-40">
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {error && errorMessage && (
        <div className="text-red-500 mt-1 text-xs">{errorMessage}</div>
      )}
    </div>
  );
}

export default Select;
