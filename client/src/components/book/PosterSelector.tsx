import { FC, InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  src?: string;
  isInvalid?: boolean;
  fileName?: string;
  errorMessage?: ReactNode;
}

const PosterSelector: FC<Props> = ({
  fileName,
  errorMessage,
  src,
  isInvalid,
  ...props
}) => {
  return (
    <div>
      <label
        className={clsx(
          "inline-block cursor-pointer",
          isInvalid && "text-red-400",
        )}
        htmlFor={props.name}
      >
        <input type={"file"} id={props.name} hidden {...props} />

        <div
          className={clsx(
            "hover:bg-default-200 flex h-32 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-md transition",
            isInvalid ? "ring-2 ring-red-400" : "bg-default-100",
          )}
        >
          {src ? (
            <img src={src} className={"object-fill"} alt={"poster"} />
          ) : (
            <p className={"text-sm"}>Select Poster</p>
          )}
        </div>
        {fileName ? (
          <p className={"w-28 truncate text-sm"}>{fileName}</p>
        ) : null}
        {errorMessage}
      </label>
    </div>
  );
};
export default PosterSelector;
