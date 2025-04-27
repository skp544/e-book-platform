import { FC, useEffect, useState } from "react";
import { AuthorInfo, AuthorInitialState } from "../../types";
import useAuth from "../../hooks/useAuth.ts";
import RichEditor from "../rich-editor";
import ErrorList from "../common/ErrorList.tsx";
import { Button, Input } from "@heroui/react";
import { MdClose, MdOutlineAdd } from "react-icons/md";
import { newAuthorSchema } from "../../schemas";

interface Props {
  btnTitle?: string;
  onSubmit(data: AuthorInfo): Promise<void>;
  initialState?: AuthorInitialState;
}

const AuthorForm: FC<Props> = ({ btnTitle, onSubmit, initialState }) => {
  const { profile } = useAuth();
  const [socialLinks, setSocialLinks] = useState([""]);
  const [about, setAbout] = useState("");
  const [errors, setErrors] = useState<{
    [key: string]: string[] | undefined;
  }>();
  const [busy, setBusy] = useState(false);

  const addLinkFields = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  const removeLinkFields = (index: number) => {
    const oldList = [...socialLinks];
    oldList.splice(index, 1);
    setSocialLinks(oldList);
  };

  const updateSocialLinks = (index: number, value: string) => {
    const oldList = [...socialLinks];
    oldList[index] = value;
    setSocialLinks(oldList);
  };

  const handleSubmit = async () => {
    const links: string[] = [];

    socialLinks.forEach((link) => {
      if (link.trim()) {
        links.push(link);
      }
    });

    const data = {
      name: profile?.name,
      about,
      socialLinks: links,
    };

    const result = newAuthorSchema.safeParse(data);

    if (!result.success) {
      return setErrors(result.error.flatten().fieldErrors);
    }

    setBusy(true);
    await onSubmit(result.data);
    setBusy(false);
  };

  useEffect(() => {
    if (initialState) {
      setAbout(initialState.about);
      let links = [""];
      if (initialState.socialLinks?.length) {
        links = initialState.socialLinks;
      }
      setSocialLinks(links);
    }
  }, [initialState]);

  return (
    <div className={"space-y-4 p-4"}>
      <p>
        Name: <span className={"text-lg font-semibold"}>{profile?.name}</span>
      </p>

      <RichEditor
        value={about}
        onChange={setAbout}
        editable
        placeholder={"Say who you are to the leaders..."}
        isInvalid={!!errors?.about}
        errorMessage={<ErrorList errors={errors?.about} />}
      />

      <div className={"space-y-4"}>
        <p className={"text-sm font-semibold"}>Social Links: </p>
        <ErrorList errors={errors?.socialLinks} />
        {socialLinks.map((_, index) => {
          return (
            <div key={index} className={"flex items-center space-x-4"}>
              <Input
                onChange={({ target }) =>
                  updateSocialLinks(index, target.value)
                }
                value={socialLinks[index]}
                placeholder={"https://instagram.com/something"}
              />
              {socialLinks.length > 1 && (
                <Button
                  size={"sm"}
                  isIconOnly
                  onPress={() => removeLinkFields(index)}
                >
                  <MdClose />
                </Button>
              )}
            </div>
          );
        })}

        <div className={"flex justify-end"}>
          <Button size={"sm"} isIconOnly onPress={addLinkFields}>
            <MdOutlineAdd size={24} />
          </Button>
        </div>
      </div>

      <Button isLoading={busy} onPress={handleSubmit}>
        {btnTitle}
      </Button>
    </div>
  );
};
export default AuthorForm;
