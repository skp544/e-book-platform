import { useParams, useSearchParams } from "react-router-dom";
import { getBookAccessUrlApi } from "../apis/book.ts";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Settings } from "../types";
import client from "../apis/client.ts";
import EpubReader from "../components/reader";

const ReadingPage = () => {
  const { slug } = useParams();
  const [url, setUrl] = useState();
  const [searchParam] = useSearchParams();
  const title = searchParam.get("title");
  const bookId = searchParam.get("id");
  const [settings, setSettings] = useState<Settings>({
    highlights: [],
    lastLocation: "",
  });

  const fetchBookUrl = async () => {
    if (!slug) return;
    const response = await getBookAccessUrlApi(slug);

    if (!response.success) {
      return toast.error(response.message);
    }

    const urlRes = await client.get(response.data.url, {
      responseType: "blob",
    });

    console.log(urlRes.data);

    setUrl(urlRes.data);
    setSettings(response?.data.settings);
    console.log(response.data);
  };

  useEffect(() => {
    if (!slug) return;

    fetchBookUrl();
  }, [slug]);

  return (
    <div>
      <EpubReader
        url={url}
        title={title || ""}
        // highlights={settings.highlights}
        // lastLocation={settings.lastLocation}
        // onHighlight={handleOnHighlightSelection}
        // onHighlightClear={handleOnHighlightClear}
        // onLocationChanged={handleLocationChanged}
      />
    </div>
  );
};

export default ReadingPage;
