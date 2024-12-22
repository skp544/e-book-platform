import { Avatar, Button, Input } from "@nextui-org/react";
import { ChangeEventHandler, useState } from "react";
import { NewUserInfo } from "../../types";

interface Props {
  name?: string;
  avatar?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  title: string;
  btnTitle: string;
}

const NewUserForm = ({ name, avatar, onSubmit , title, btnTitle }: Props) => {
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

  const handleSubmit = async () => {
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
    <div className={"flex-1 flex justify-center items-center"}>
      <div
        className={
          "w-96 border-2 p-5 rounded-md flex justify-center items-center flex-col"
        }
      >
        <h1 className={"text-center text-xl font-semibold"}>
            {title}
        </h1>
        <form className={"w-full space-y-6 mt-6"}>
          <label
            htmlFor={"avatar"}
            className={"cursor-pointer flex items-center justify-center"}
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
          <Button
            isLoading={busy}
            type={"button"}
            onClick={handleSubmit}
            className={"w-full"}
          >
              {btnTitle}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewUserForm;
