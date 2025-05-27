import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  onClear: () => void;
  showBorder?: boolean;
}

export function Input({
  title,
  value,
  onClear,
  showBorder = false,
  className,
  ...rest
}: InputProps): JSX.Element {
  const hasValue = (value?.toString()?.length ?? 0) > 0;

  return (
    <div className={className + " flex flex-col items-start justify-start"}>
      {title && <p className="text-lg">{title}</p>}
      <div className="relative w-full">
        <input
          {...rest}
          className={`text-gray-900 h-[40px] px-2 py-1 rounded  w-full ${
            showBorder ? "border-2 border-gray-700" : ""
          }`}
          value={value}
        />
        {hasValue && (
          <button
            className="absolute right-[5px] text-gray-900"
            onClick={onClear}
          >
            X
          </button>
        )}
      </div>
    </div>
  );
}
