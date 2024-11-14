"use client"

import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/util";
import { SelectHTMLAttributes } from "react";

interface SelectOption {
  key: string;
  value: string;
}
//@ts-ignore
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  error?: boolean;
  className?: string;
}

export const Select = ({ 
  options, 
  onSelect, 
  placeholder = "Select an option",
  defaultValue,
  error,
  className,
  disabled,
  ...props
}: SelectProps) => {
  return (
    <div className="relative">
      <select 
        onChange={(e) => onSelect(e.target.value)}
        defaultValue={defaultValue || ""}
        disabled={disabled}
        className={cn(
          "appearance-none w-full rounded-md border px-3 py-2 text-sm",
          "bg-white dark:bg-gray-800/50",
          "border-gray-200 dark:border-gray-700/50",
          "text-gray-900 dark:text-gray-100",
          "shadow-sm transition-colors duration-200",
          "focus:border-purple-500 dark:focus:border-purple-500",
          "focus:outline-none focus:ring-1",
          "focus:ring-purple-500/50 dark:focus:ring-purple-500/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-gray-500 dark:placeholder:text-gray-500",
          error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/50",
          className
        )}
        {...props}
      >
        {!defaultValue && (
          <option value="" disabled className="dark:bg-gray-800 bg-white text-gray-500">
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option 
            key={option.key} 
            value={option.key}
            className="dark:bg-gray-800 bg-white dark:text-gray-100 text-gray-900"
          >
            {option.value}
          </option>
        ))}
      </select>
      
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-gray-400",
            disabled && "opacity-50"
          )} 
        />
      </div>

      {error && props["aria-errormessage"] && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400" id={props["aria-errormessage"]}>
          {props["aria-errormessage"]}
        </p>
      )}
    </div>
  );
};

export default Select;