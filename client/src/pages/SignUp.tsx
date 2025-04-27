import { FormEventHandler, useState } from "react";
import { RiMailCheckLine } from "react-icons/ri";
import { addToast, Button, Input } from "@heroui/react";
import Book from "../components/svg/Book.tsx";
import { emailRegex } from "../helpers";
import { generateLink } from "../apis/auth.ts";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [invalidForm, setInvalidForm] = useState(false);
  const [showSuccessResponse, setShowSuccessResponse] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      return setInvalidForm(true);
    }

    setBusy(true);
    const response = await generateLink({ email });
    setBusy(false);

    if (!response?.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    setShowSuccessResponse(true);

    addToast({
      color: "success",
      title: "Success",
      description: response?.message,
    });
  };

  if (showSuccessResponse) {
    return (
      <div className={"flex flex-1 flex-col items-center justify-center"}>
        <RiMailCheckLine size={80} className={"animate-bounce"} />
        <p className={"text-lg font-semibold"}>
          Please check your email we just sent you a magic link.
        </p>
      </div>
    );
  }

  return (
    <div className={"flex flex-1 items-center justify-center"}>
      <div
        className={
          "flex w-96 flex-col items-center justify-center rounded border-2 p-5"
        }
      >
        <Book className={"h-44 w-44"} />
        <h1 className={"text-center text-xl font-semibold"}>
          Books are the keys to countless doors. Sign up and unlock your
          potential
        </h1>

        <form onSubmit={handleSubmit} className={"mt-6 w-full space-y-6"}>
          <Input
            type={"email"}
            label={"Email"}
            placeholder={"john@email.com"}
            variant={"bordered"}
            value={email}
            onChange={({ target }) => {
              setEmail(target.value);
            }}
            isRequired
            errorMessage={"Invalid email!"}
            isInvalid={invalidForm}
          />

          <Button isLoading={busy} type={"submit"} className={"w-full"}>
            Send Me The Link
          </Button>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
