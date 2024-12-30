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
import { BookDefaultForm, BookToSubmit } from "../../types";
import { ChangeEventHandler, useState } from "react";
import { parseDate } from "@internationalized/date";
import { newBookSchema } from "../../schemas";
import ErrorList from "../common/ErrorList.tsx";
import clsx from "clsx";

interface Props {
  title: string;
  submitBtnTitle: string;
  initialState?: unknown;
  onSubmit(data: FormData): Promise<void>;
}

const defaultBookInfo = {
  title: "",
  description: "",
  language: "",
  genre: "",
  mrp: "",
  sale: "",
  publicationName: "",
};

const BookForm = ({ title, submitBtnTitle, onSubmit }: Props) => {
  const [bookInfo, setBookInfo] = useState<BookDefaultForm>({
    ...defaultBookInfo,
  });
  const [cover, setCover] = useState("");
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: string[] | undefined;
  }>();
  const [busy, setBusy] = useState(false);

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { value, name } = target;

    setBookInfo({ ...bookInfo, [name]: value });
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { files, name } = target;

    if (!files) return;

    const file = files[0];

    if (name === "cover" && file?.size) {
      try {
      setCover(URL.createObjectURL(file));
      } catch (e) {
        setCover("")
      }
    }
    setBookInfo({ ...bookInfo, [name]: file });
  };

  const handleBookPublish = async () => {
    const formData = new FormData();

    const { file, cover } = bookInfo;

    if (file?.type !== "application/epub+zip") {
      return setErrors({
        ...errors,
        file: ["Please select a valid (.epub) file."],
      });
    } else {
      setErrors({
        ...errors,
        file: undefined,
      });
    }

    if (cover && !cover.type.startsWith("image/")) {
      return setErrors({
        ...errors,
        cover: ["Please select a valid poster file."],
      });
    } else {
      setErrors({
        ...errors,
        cover: undefined,
      });
    }

    if (cover) {
      formData.append("cover", cover);
    }

    const bookToSend: BookToSubmit = {
      title: bookInfo.title,
      description: bookInfo.description,
      genre: bookInfo.genre,
      publicationName: bookInfo.publicationName,
      publishedAt: bookInfo.publishedAt,
      language: bookInfo.language,
      uploadMethod: "local",
      price: {
        mrp: Number(bookInfo.mrp),
        sale: Number(bookInfo.sale),
      },
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    };

    const result = newBookSchema.safeParse(bookToSend);

    if (!result.success) {
      return setErrors(result.error.flatten().fieldErrors);
    }

    if (result.data.uploadMethod === "local") {
      formData.append("book", file);
    }

    for (const key in bookToSend) {
      type keyType = keyof typeof bookToSend;
      const value = bookToSend[key as keyType];

      if (typeof value === "string") {
        formData.append(key, value);
      }
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      }
    }

    setBusy(true);
    await onSubmit(formData);
    setBusy(false);
    setBookInfo({ ...defaultBookInfo, file: null });
    setCover("");
  };

  const handleBookUpdate = async () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isForUpdate) {
      await handleBookUpdate();
    } else {
      await handleBookPublish();
    }
    // Do something with the bookInfo
    console.log(bookInfo, "book info");
  };

  return (
    <form className={"p-10 space-y-6"}>
      <h1 className={"pb-6 font-semibold text-2xl w-full"}>{title}</h1>

      <div>
        <label
          htmlFor={"file"}
          className={clsx(errors?.file && "text-red-400")}
        >
          <span className={""}>Select File:</span>
          <input
            accept={"application/epub+zip"}
            type={"file"}
            name={"file"}
            id={"file"}
            onChange={handleFileChange}
          />
        </label>
        <ErrorList errors={errors?.file} />
      </div>

      {/* Poster Selector */}
      <PosterSelector
        name={"cover"}
        src={cover}
        fileName={bookInfo.cover?.name}
        onChange={handleFileChange}
        isInvalid={!!errors?.cover}
        errorMessage={<ErrorList errors={errors?.cover} />}
      />

      <Input
        type={"text"}
        name={"title"}
        placeholder={"Think & Grow Rich"}
        isRequired
        label={"Book Title"}
        value={bookInfo.title}
        onChange={handleTextChange}
        isInvalid={!!errors?.title}
        errorMessage={<ErrorList errors={errors?.title} />}
      />

      {/* About For Book */}
      <RichEditor
        isInvalid={!!errors?.description}
        errorMessage={<ErrorList errors={errors?.description} />}
        placeholder={"About book..."}
        editable
        value={bookInfo.description}
        onChange={(description) => setBookInfo({ ...bookInfo, description })}
      />

      <Input
        type={"text"}
        name={"publicationName"}
        placeholder={"Penguin Book"}
        isRequired
        label={"Publication Name"}
        value={bookInfo.publicationName}
        onChange={handleTextChange}
        isInvalid={!!errors?.publicationName}
        errorMessage={<ErrorList errors={errors?.publicationName} />}
      />

      <DatePicker
        label={"Publish Date"}
        onChange={(date) => {
          setBookInfo({ ...bookInfo, publishedAt: date?.toString() });
        }}
        value={bookInfo.publishedAt ? parseDate(bookInfo.publishedAt) : null}
        showMonthAndYearPickers
        isRequired
        isInvalid={!!errors?.publishedAt}
        errorMessage={<ErrorList errors={errors?.publishedAt} />}
      />

      <Autocomplete
        label={"Language"}
        placeholder={"Select Language"}
        defaultSelectedKey={bookInfo.language}
        isInvalid={!!errors?.language}
        isRequired
        errorMessage={<ErrorList errors={errors?.language} />}
        onSelectionChange={(key = "") => {
          setBookInfo({ ...bookInfo, language: key as string });
        }}
      >
        {languages.map((item) => {
          return (
            <AutocompleteItem value={item.name} key={item.name}>
              {item.name}
            </AutocompleteItem>
          );
        })}
      </Autocomplete>

      {/* Genres */}
      <Autocomplete
        isInvalid={!!errors?.genre}
        errorMessage={<ErrorList errors={errors?.genre} />}
        label={"Genre"}
        placeholder={"Select a Genre"}
        defaultSelectedKey={bookInfo.genre}
        isRequired
        onSelectionChange={(key = "") => {
          setBookInfo({ ...bookInfo, genre: key as string });
        }}
      >
        {genres.map((item) => {
          return (
            <AutocompleteItem value={item.name} key={item.name}>
              {item.name}
            </AutocompleteItem>
          );
        })}
      </Autocomplete>

      {/* Price Sectiom */}
      <div>
        <div className={"bg-default-100 rounded-md py-2 px-3"}>
          <p className={clsx("text-xs pl-3", errors?.price && "text-red-400")}>
            Price*
          </p>

          <div className={"flex space-x-6 mt-2"}>
            <Input
              type={"number"}
              name={"mrp"}
              placeholder={"0.00"}
              isRequired
              onChange={handleTextChange}
              value={bookInfo.mrp}
              label={"MRP"}
              isInvalid={!!errors?.price}
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
              onChange={handleTextChange}
              isRequired
              label={"Sale Price"}
              value={bookInfo.sale}
              isInvalid={!!errors?.price}
              startContent={
                <div className={"pointer-events-none flex items-center"}>
                  <span className={"text-default-400 text-sm"}>$</span>
                </div>
              }
            />
          </div>
        </div>
        <div className="p-2">
          <ErrorList errors={errors?.price} />
        </div>
      </div>

      <Button
        isLoading={busy}
        type={"button"}
        onClick={handleSubmit}
        className={"w-full"}
      >
        {submitBtnTitle}
      </Button>
    </form>
  );
};

export default BookForm;
