import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    flatpickrRef.current = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
    });

    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }
    };
  }, [mode, id]); 

  
  useEffect(() => {
    if (flatpickrRef.current) {
      if (defaultDate) {
        flatpickrRef.current.setDate(defaultDate);
      } else {
        flatpickrRef.current.clear();
      }
    }
  }, [defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border
           appearance-none px-2 py-1 text-xs shadow-theme-xs
            placeholder:text-gray-400 focus:outline-hidden
             focus:ring-3  dark:bg-gray-900 dark:text-white/90
              dark:placeholder:text-white/30  bg-transparent text-gray-800
               border-gray-300 focus:border-brand-300 focus:ring-brand-500/20
                dark:border-gray-700  dark:focus:border-brand-800"
        />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
        <CalenderIcon className="size-4" />
      </span>
          </div>
        </div>
  );
}