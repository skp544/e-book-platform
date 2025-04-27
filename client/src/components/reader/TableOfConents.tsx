import { Accordion, AccordionItem } from "@heroui/react";
import { FC } from "react";

type BookNavItem = { title: string; href: string };
export type BookNavList = {
  label: BookNavItem;
  subItems: BookNavItem[];
};

interface Props {
  data: BookNavList[];
  visible?: boolean;
  onClick(href: string): void;
}

const TableOfContent: FC<Props> = ({ visible, data, onClick }) => {
  return (
    <div
      style={{ right: visible ? "0" : "-100%" }}
      className="dark:bg-book-dark dark:text-book-dark fixed right-0 top-0 z-50 flex h-screen w-3/4 flex-col space-y-3 overflow-y-scroll bg-white p-3 shadow-md transition-all md:w-96"
    >
      {data.map(({ label, subItems }) => {
        if (!subItems.length)
          return (
            <div key={label.title}>
              <p
                onClick={() => onClick(label.href)}
                className="cursor-pointer py-2 text-large hover:underline"
              >
                {label.title}
              </p>
            </div>
          );

        return (
          <Accordion key={label.title} title={label.title}>
            <AccordionItem title={label.title}>
              <div className="space-y-3">
                {subItems.map((item) => {
                  return (
                    <p
                      key={item.title}
                      onClick={() => onClick(item.href)}
                      className="cursor-pointer pl-6 text-large hover:underline"
                    >
                      {item.title}
                    </p>
                  );
                })}
              </div>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
};

export default TableOfContent;
