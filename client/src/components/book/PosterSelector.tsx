import { InputHTMLAttributes } from "react";
import  clsx from  "clsx"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  src?: string;
  isInvalid?: boolean;
  fileName?: string;
  errorMessage?: string;
}

const PosterSelector = ({ fileName, errorMessage,  src,isInvalid, ...props }: Props) => {
  return (
    <div>
      <label className={clsx("cursor-pointer inline-block", isInvalid && "text-red-400" )} htmlFor={props.name}>
        <input type={"file"} id={props.name} hidden {...props} />

        <div
          className={
           clsx( "hover:bg-default-200 transition w-28 h-32 flex items-center justify-center rounded-md overflow-hidden cursor-pointer", isInvalid ? "ring-2 ring-red-400" : "bg-default-100")
          }
        >
          {src ? (
            <img src={src} className={"object-fill"} alt={"poster"} />
          ) : (
            <p className={"text-sm"}>Select Poster</p>
          )}
        </div>
        {fileName ? <p className={"w-28 text-sm truncate"}>{fileName}</p> : null}
        {errorMessage ? <p className={"text-sm text-red-400"}>{errorMessage}</p> : null}
      </label>
    </div>
  );
};

export default PosterSelector;
