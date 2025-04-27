import { ChangeEventHandler, FC, FormEventHandler, useState } from "react";
import { NewUserInfo } from "../../types";
import { Avatar, Button, Input } from "@heroui/react";

interface Props {
  name?: string;
  avatar?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  title: string;
  btnTitle: string;
}

const NewUserForm: FC<Props> = ({
  name,
  avatar,
  onSubmit,
  title,
  btnTitle,
}) => {
  const [userInfo, setUserInfo] = useState<NewUserInfo>({
    name: "",
  });
  const [localAvatar, setLocalAvatar] = useState<string | undefined>(undefined);
  const [invalidForm, setInvalidForm] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value, files } = target;

    if (name === "name") {
      setUserInfo({
        ...userInfo,
        name: value,
      });
    }

    if (name === "avatar" && files) {
      const file = files[0];
      setUserInfo({
        ...userInfo,
        avatar: file,
      });
      setLocalAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    if (userInfo.name.trim().length < 3) {
      return setInvalidForm(true);
    } else {
      setInvalidForm(false);
    }

    formData.append("name", userInfo.name);
    if (userInfo?.avatar?.type.startsWith("image")) {
      formData.append("avatar", userInfo.avatar);
    }
    setBusy(true);
    await onSubmit(formData);
    setBusy(false);
  };

  return (
    <div className={"flex flex-1 items-center justify-center"}>
      <div
        className={
          "flex w-96 flex-col items-center justify-center rounded-md border-2 p-5"
        }
      >
        <h1 className={"text-center text-xl font-semibold"}>{title}</h1>
        <form onSubmit={handleSubmit} className={"mt-6 w-full space-y-6"}>
          <label
            htmlFor={"avatar"}
            className={"flex cursor-pointer items-center justify-center"}
          >
            <Avatar
              isBordered
              radius={"sm"}
              name={userInfo.name || name}
              src={localAvatar || avatar}
            />
            <input
              type={"file"}
              name={"avatar"}
              id={"avatar"}
              hidden
              accept={"image/*"}
              onChange={handleChange}
            />
          </label>

          <Input
            type={"text"}
            label={"Full Name"}
            placeholder={"John Doe"}
            variant={"bordered"}
            value={userInfo.name || name}
            onChange={handleChange}
            name={"name"}
            isInvalid={invalidForm}
            errorMessage={"Name must be at least 3 characters"}
          />
          <Button isLoading={busy} type={"submit"} className={"w-full"}>
            {btnTitle}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default NewUserForm;
