import { Divider } from "@nextui-org/react";

interface Props {
  title?: string;
}

const DividerWithTitle = ({ title }: Props) => {
  if (!title) {
    return null;
  }

  return (
    <div>
      <p className="dark:bg-white dark:text-black bg-black text-white p-1 font-semibold rounded inline-block mb-1">
        {title}
      </p>

      <Divider className="dark:bg-white bg-black" />
    </div>
  );
};

export default DividerWithTitle;
