import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthorDetailsApi } from "../apis/author.ts";
import toast from "react-hot-toast";
import { IAuthorInfo } from "../types";
import { User, Link } from "@nextui-org/react";
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
      return toast.error(response.message);
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
      <div className={"text-center pt-10 animate-pulse"}>
        <p className={""}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={"p-5 lg:p-0"}>
      <User name={authorInfo?.name} />

      <div className={"py-6 pl-10"}>
        <h1 className="font-semibold text-lg">Social Links:</h1>

        <div className="flex items-center space-x-2">
          {authorInfo?.socialLinks.map((link) => {
            const { host } = new URL(link);
            return (
              <div key={link}>
                <Link
                  className="text-gray-800 dark:text-white font-semibold underline"
                  href={link}
                  target="_blank"
                >
                  {host}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pl-10 mt-3">
        <RichEditor value={authorInfo?.about} className="regular" />
      </div>

      <div className="mt-6">
        <BookList title="Books By The Author" data={authorInfo?.books || []} />
      </div>
    </div>
  );
};

export default AuthorPage;
