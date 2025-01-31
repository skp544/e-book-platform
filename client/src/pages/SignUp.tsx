import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { emailRegex } from "../helper";
import { generateLinkApi } from "../apis/auth.ts";
import { RiMailCheckLine } from "react-icons/ri";
import toast from "react-hot-toast";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [invalidForm, setInvalidForm] = useState(false);
  const [showSuccessResponse, setShowSuccessResponse] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) return setInvalidForm(true);
    setInvalidForm(false);

    setBusy(true);
    const response = await generateLinkApi({ email });
    setBusy(false);

    if (!response.success) {
      return toast.error(response.message);
    }
    if (response.success) {
      setShowSuccessResponse(true);
    }
  };

  if (showSuccessResponse) {
    return (
      <div className={"flex-1 flex flex-col items-center justify-center"}>
        <RiMailCheckLine size={80} className={"animate-bounce"} />
        <p className={"text-lg font-semibold"}>
          Please check your email we just sent you a magic link.
        </p>
      </div>
    );
  }

  return (
    <div className={"flex-1 flex items-center justify-center"}>
      <div
        className={
          "w-96 border-2 p-5 rounded flex flex-col items-center justify-center"
        }
      >
        {/*<Book  />*/}
        {/*  <SlBookOpen className={"w-44 h-44"} />*/}
        <img className={"w-44 h-44"} src={"/book.png"} alt={"book"} />
        <h1 className={"text-center text-xl font-semibold"}>
          Books are the keys to countless doors. Sign up and unlock your
          potential
        </h1>

        <div className={"w-full space-y-6 mt-6"}>
          <Input
            label="Email"
            placeholder="john@email.com"
            variant="bordered"
            isInvalid={invalidForm}
            errorMessage="Invalid email!"
            value={email}
            isRequired
            onChange={({ target }) => {
              setEmail(target.value);
            }}
          />
          <Button
            isLoading={busy}
            onPress={handleSubmit}
            type={"button"}
            className={"w-full"}
          >
            Send Me The Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
