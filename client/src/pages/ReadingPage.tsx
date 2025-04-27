import { useParams, useSearchParams } from "react-router-dom";
import { getBookAccessUrlApi } from "../apis/book.ts";
import { useCallback, useEffect, useState } from "react";
import { Settings } from "../types";
import client from "../apis/client.ts";
import EpubReader from "../components/reader";
import { addToast } from "@heroui/react";
import { debounce } from "../helpers";
import { bookHistoryApi } from "../apis/history.ts";

const updateLastLocation = (bookId: string, lastLocation: string) => {
  client.post("/history", {
    bookId,
    lastLocation,
    remove: false,
  });
};

const debounceUpdateLastLocation = debounce(updateLastLocation, 500);

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

  const handleOnHighlightSelection = (data: Highlight) => {
    setSettings({ ...settings, highlights: [...settings.highlights, data] });

    const formData = {
      bookId,
      highlights: [data],
      remove: false,
    };

    bookHistoryApi(formData);

    client.post("/history");
  };

  const handleOnHighlightClear = (cfi: string) => {
    const newHighlights = settings.highlights.filter(
      (item) => item.selection !== cfi,
    );

    setSettings({ ...settings, highlights: newHighlights });

    const formData = {
      bookId,
      highlights: [{ selection: cfi, fill: "" }],
      remove: true,
    };

    bookHistoryApi(formData);

    client.post("/history");
  };

  const handleLocationChanged = useCallback(
    (location: string) => {
      try {
        if (bookId) debounceUpdateLastLocation(bookId, location);
      } catch (error) {
        console.log(error);
      }
    },
    [bookId],
  );

  const fetchBookUrl = async () => {
    if (!slug) return;
    const response = await getBookAccessUrlApi(slug);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
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
        highlights={settings.highlights}
        lastLocation={settings.lastLocation}
        onHighlight={handleOnHighlightSelection}
        onHighlightClear={handleOnHighlightClear}
        onLocationChanged={handleLocationChanged}
      />
    </div>
  );
};

export default ReadingPage;
