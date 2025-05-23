import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAuthorDetailsApi } from "../apis/author.ts";
import { addToast, User } from "@heroui/react";
import { IAuthorInfo } from "../types";
import RichEditor from "../components/rich-editor";
import BookList from "../components/book/BookList.tsx";

const AuthorPage = () => {
  const { id } = useParams();
  const [fetching, setFetching] = useState(true);
  const [authorInfo, setAuthorInfo] = useState<IAuthorInfo>();

  const fetchAuthorInfo = async () => {
    if (!id) {
      return;
    }
    const response = await getAuthorDetailsApi(id);
    setFetching(false);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    setAuthorInfo(response.data);
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchAuthorInfo();
  }, [id]);

  if (fetching) {
    return (
      <div className={"animate-pulse pt-10 text-center"}>
        <p className={""}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={"p-5 lg:p-0"}>
      <User name={authorInfo?.name} />

      <div className={"py-6 pl-10"}>
        <h1 className="text-lg font-semibold">Social Links:</h1>

        <div className="flex items-center space-x-2">
          {authorInfo?.socialLinks &&
            authorInfo?.socialLinks?.length > 0 &&
            authorInfo?.socialLinks.map((link) => {
              const { host } = new URL(link);
              return (
                <div key={link}>
                  <Link
                    className="font-semibold text-gray-800 underline dark:text-white"
                    to={link}
                    target="_blank"
                  >
                    {host}
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
      <div className="mt-3 pl-10">
        <RichEditor value={authorInfo?.about} className="regular" />
      </div>

      <div className="mt-6">
        <BookList title="Books By The Author" data={authorInfo?.books || []} />
      </div>
    </div>
  );
};
export default AuthorPage;
