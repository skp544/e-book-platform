import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import {
  BookDefaultForm,
  BookToSubmit,
  InitialBookToUpdate,
} from "../../types";
import ErrorList from "../common/ErrorList.tsx";
import PosterSelector from "./PosterSelector.tsx";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
} from "@heroui/react";
import RichEditor from "../rich-editor";
import { genres, languages } from "../../helpers/data.ts";
import { parseDate } from "@internationalized/date";
import { newBookSchema, updateBookSchema } from "../../schemas";

interface Props {
  title: string;
  submitBtnTitle: string;
  initialState?: InitialBookToUpdate;
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

const BookForm: FC<Props> = ({
  title,
  submitBtnTitle,
  initialState,
  onSubmit,
}) => {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setCover("");
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

  const handleBookUpdate = async () => {
    const formData = new FormData();

    const { file, cover } = bookInfo;

    // Validate book file (must be epub type)
    if (file && file?.type !== "application/epub+zip") {
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

    // Validate cover file
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

    // validate data for book creation
    const bookToSend: BookToSubmit = {
      title: bookInfo.title,
      description: bookInfo.description,
      genre: bookInfo.genre,
      language: bookInfo.language,
      publicationName: bookInfo.publicationName,
      uploadMethod: "local",
      publishedAt: bookInfo.publishedAt,
      slug: initialState?.slug,
      price: {
        mrp: Number(bookInfo.mrp),
        sale: Number(bookInfo.sale),
      },
    };

    if (file) {
      bookToSend.fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
      };
    }

    const result = updateBookSchema.safeParse(bookToSend);

    if (!result.success) {
      return setErrors(result.error.flatten().fieldErrors);
    }

    if (file && result.data.uploadMethod === "local") {
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
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (isForUpdate) {
      await handleBookUpdate();
    } else {
      await handleBookPublish();
    }
  };

  useEffect(() => {
    if (initialState) {
      const {
        title,
        description,
        language,
        genre,
        publicationName,
        publishedAt,
        price,
        cover,
      } = initialState;

      if (cover) setCover(cover);

      setBookInfo({
        title,
        description,
        language,
        genre,
        publicationName,
        publishedAt,
        mrp: price.mrp,
        sale: price.sale,
      });

      setIsForUpdate(true);
    }
  }, [initialState]);

  return (
    <form className={"space-y-6 p-10"} onSubmit={handleSubmit}>
      <h1 className={"w-full pb-6 text-2xl font-semibold"}>{title}</h1>
      <div className={""}>
        <label className={""} htmlFor={"file"}>
          <span className={""}>Select File: </span>
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

      {/*  Poster Selection */}

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

      {/*  About of books */}
      <RichEditor
        placeholder={"About book..."}
        isInvalid={!!errors?.description}
        errorMessage={<ErrorList errors={errors?.description} />}
        editable
        value={bookInfo.description}
        onChange={(description) => setBookInfo({ ...bookInfo, description })}
      />

      {/*  description */}

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

      {/*  date picker */}
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

      {/*language*/}
      <Autocomplete
        label={"Language"}
        placeholder={"Select Language"}
        defaultSelectedKey={bookInfo.language}
        isInvalid={!!errors?.language}
        isRequired
        selectedKey={bookInfo.language}
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

      {/*  genres */}
      <Autocomplete
        label={"Genre"}
        placeholder={"Select a Genre"}
        isInvalid={!!errors?.genre}
        errorMessage={<ErrorList errors={errors?.genre} />}
        defaultSelectedKey={bookInfo.genre}
        selectedKey={bookInfo.genre}
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

      {/*  Price section */}
      <div>
        <div className={"rounded-md bg-default-100 px-3 py-2"}>
          <p>Price*</p>
          <div className={"mt-2 flex space-x-6"}>
            <Input
              type={"number"}
              name={"mrp"}
              label={"MRP"}
              placeholder={"0.00"}
              isRequired
              onChange={handleTextChange}
              value={bookInfo.mrp}
              isInvalid={!!errors?.price}
              startContent={
                <div className={"pointer-events-none flex items-center"}>
                  <span className={"text-sm text-default-400"}>$</span>
                </div>
              }
            />

            <Input
              type={"number"}
              name={"sale"}
              placeholder={"0.00"}
              isRequired
              label={"Sale Price"}
              onChange={handleTextChange}
              value={bookInfo.sale}
              isInvalid={!!errors?.price}
              startContent={
                <div className={"pointer-events-none flex items-center"}>
                  <span className={"text-sm text-default-400"}>$</span>
                </div>
              }
            />
          </div>
        </div>
        <div className="p-2">
          <ErrorList errors={errors?.price} />
        </div>
      </div>
      <Button isLoading={busy} type={"submit"} className={"w-full"}>
        {submitBtnTitle}
      </Button>
    </form>
  );
};
export default BookForm;
