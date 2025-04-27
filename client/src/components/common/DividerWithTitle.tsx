import { Divider } from "@heroui/react";
import { FC } from "react";

interface Props {
  title?: string;
}

const DividerWithTitle: FC<Props> = ({ title }) => {
  if (!title) {
    return null;
  }
  return (
    <div>
      <p className="mb-1 inline-block rounded bg-black p-1 font-semibold text-white dark:bg-white dark:text-black">
        {title}
      </p>

      <Divider className="bg-black dark:bg-white" />
    </div>
  );
};
export default DividerWithTitle;
