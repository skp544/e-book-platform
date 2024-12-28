import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
} from "@nextui-org/react";
import { genres, languages } from "../../helper/data.ts";
import PosterSelector from "./PosterSelector.tsx";
import RichEditor from "../rich-editor";

interface Props {
  title: string;
  submitBtnTitle: string;
  initialState?: unknown;
}

const BookForm = ({ title, submitBtnTitle }: Props) => {
  return (
    <form className={"p-10 space-y-6"}>
      <h1 className={"pb-6 font-semibold text-2xl w-full"}>{title}</h1>

      <label htmlFor={"file"}>
        <span className={""}>Select File:</span>
        <input
          accept={"application/epub+zip"}
          type={"file"}
          name={"file"}
          id={"file"}
        />
      </label>

      {/* Poster Selector */}
        <PosterSelector />

      <Input
        type={"text"}
        name={"title"}
        placeholder={"Think & Grow Rich"}
        isRequired
        label={"Book Title"}
      />

      {/* About For Book */}
      <RichEditor placeholder={"About book..."} editable />
      

      <Input
        type={"text"}
        name={"publicationName"}
        placeholder={"Penguin Book"}
        isRequired
        label={"Publication Name"}
      />

      <DatePicker label={"Publish Date"} showMonthAndYearPickers isRequired />

      <Autocomplete
        label={"Language"}
        placeholder={"Select Language"}
        items={languages}
      >
        {(item) => {
          return (
            <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
          );
        }}
      </Autocomplete>

      {/* Genres */}
      <Autocomplete
        label={"Language"}
        placeholder={"Select Language"}
        items={genres}
      >
        {(item) => {
          return (
            <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
          );
        }}
      </Autocomplete>

      {/* Price Sectiom */}

      <div className={"bg-default-100 rounded-md py-2 px-3"}>
        <p className={"text-xs pl-3"}>Price*</p>

        <div className={"flex space-x-6 mt-2"}>
          <Input
            type={"number"}
            name={"mrp"}
            placeholder={"0.00"}
            isRequired
            label={"MRP"}
            startContent={
              <div className={"pointer-events-none flex items-center"}>
                <span className={"text-default-400 text-sm"}>$</span>
              </div>
            }
          />
          <Input
            type={"number"}
            name={"sale"}
            placeholder={"0.00"}
            isRequired
            label={"Sale Price"}
            startContent={
              <div className={"pointer-events-none flex items-center"}>
                <span className={"text-default-400 text-sm"}>$</span>
              </div>
            }
          />
        </div>
      </div>

      <Button className={"w-full"}>{submitBtnTitle}</Button>
    </form>
  );
};

export default BookForm;
