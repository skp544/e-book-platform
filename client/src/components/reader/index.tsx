import { Book, Rendition } from "epubjs";
import { useEffect, useState } from "react";
import Navigator from "./Navigator.tsx";
import LoadingIndicator from "./LoadingIndicator.tsx";
import TableOfContent, { BookNavList } from "./TableOfConents.tsx";
import { Highlight, RelocatedEvent } from "../../types";
import { Button } from "@nextui-org/react";
import { IoMenu } from "react-icons/io5";
import { MdOutlineStickyNote2 } from "react-icons/md";
import ThemeOptions, { ThemeModes } from "./ThemeOptions.tsx";
import FontOptions from "./FontOptions.tsx";
import HighlightOptions from "./HighlightOptions.tsx";

interface Props {
  url?: Object;
  title?: string;
  lastLocation?: string;
  highlights: Highlight[];
  onHighlight(data: Highlight): void;
  onLocationChanged(location: string): void;
  onHighlightClear(selection: string): void;
}

const container = "epub_container";
const wrapper = "epub_wrapper";

const selectTheme = (rendition: Rendition, mode: ThemeModes) => {
  if (mode === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  rendition.themes.select(mode);
};

const getElementSize = (id: string) => {
  const ele = document.getElementById(id);
  let width = 0;
  let height = 0;
  if (ele) {
    const result = ele.getBoundingClientRect();
    width = result.width;
    height = result.height;
  }
  return { width, height };
};

const filterHref = (spineHrefList: string[], href: string) => {
  const foundItem = spineHrefList.find((spineHref) => {
    const regex = new RegExp("[^/]+/([^/]+.xhtml)");
    const list = regex.exec(spineHref);
    if (list) {
      if (href.startsWith(list[1])) {
        return true;
      }
    }
  });

  return foundItem || href;
};

const loadTableOfContent = async (book: Book) => {
  const [nav, spine] = await Promise.all([
    book.loaded.navigation,
    book.loaded.spine,
  ]);

  let spineHref: string[] = [];
  if (!Array.isArray(spine)) {
    const { spineByHref } = spine as { spineByHref: { [key: string]: number } };
    const entires = Object.entries(spineByHref);
    entires.sort((a, b) => a[1] - b[1]);
    spineHref = entires.map(([key]) => key);
  }
  const { toc } = nav;

  const navLabels: BookNavList[] = [];
  toc.forEach((item) => {
    if (item.subitems?.length) {
      navLabels.push({
        label: { title: item.label, href: filterHref(spineHref, item.href) },
        subItems: item.subitems.map(({ href, label }) => {
          return {
            href: filterHref(spineHref, href),
            title: label,
          };
        }),
      });
    } else {
      navLabels.push({
        label: { title: item.label, href: filterHref(spineHref, item.href) },
        subItems: [],
      });
    }
  });

  return navLabels;
};

const EpubReader = ({ url, title }: Props) => {
  const [rendition, setRendition] = useState<Rendition>();
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [locationBeforeNoteOpen, setLocationBeforeNoteOpen] = useState("");
  const [showHighlightOption, setShowHighlightOptions] = useState(false);
  const [selectedCfi, setSelectedCfi] = useState("");
  const [showToc, setShowToc] = useState(false);
  const [tableOfContent, setTableOfContent] = useState<BookNavList[]>([]);
  const [settings, setSettings] = useState({
    fontSize: 22,
    currentLocation: "",
  });
  const [page, setPage] = useState({
    start: 0,
    end: 0,
    total: 0,
  });

  const updatePageCounts = (rendition: Rendition) => {
    const location = rendition.currentLocation() as unknown as RelocatedEvent;
    const start = location.start.displayed.page;
    const end = location.end.displayed.page;
    const total = location.start.displayed.total;
    setPage({ start, end, total });
  };

  const handleNavigation = (href: string) => {
    rendition?.display(href);
  };

  const toggleToc = () => {
    setShowToc(!showToc);
  };

  const hideToc = () => {
    setShowToc(false);
  };

  const handleThemeSelection = (mode: ThemeModes) => {
    if (!rendition) return;

    selectTheme(rendition, mode);
  };

  const handleFontSizeUpdate = (mode: "increase" | "decrease") => {
    if (!rendition) return;

    let { fontSize } = settings;
    if (mode === "increase") {
      fontSize += 2;
    } else {
      fontSize -= 2;
    }
    rendition.themes.fontSize(fontSize + "px");
    setSettings({ ...settings, fontSize });
    updatePageCounts(rendition);
  };

  useEffect(() => {
    if (!url) return;

    const book = new Book(url);
    const { width, height } = getElementSize(wrapper);
    const rendition = book.renderTo(container, {
      width,
      height,
    });

    rendition.display();

    // Let's fire the on click if we click inside the book
    rendition.on("click", () => {
      hideToc();
    });

    // book.loaded.navigation.then(console.log);
    loadTableOfContent(book)
      .then(setTableOfContent)
      .finally(() => {
        setLoading(false);
      });

    // rendition.on("rendered", () => {
    //   rendition.display();
    //   setLoading(false);
    //   // rendition.next(2);
    // });

    setRendition(rendition);

    return () => {
      if (book) {
        book.destroy();
      }
    };
  }, [url]);

  return (
    <div className="h-screen flex flex-col group dark:bg-book-dark dark:text-book-dark">
      <LoadingIndicator visible={loading} />

      <div className="flex items-center h-14 shadow-md opacity-0 group-hover:opacity-100 transition">
        <div className="max-w-3xl md:mx-auto md:pl-0 pl-5">
          <h1 className="line-clamp-1 font-semibold text-large">{title}</h1>
        </div>

        <div className="ml-auto">
          <div className="flex items-center justify-center space-x-3">
            {/* Theme Options */}
            <ThemeOptions onThemeSelect={handleThemeSelection} />
            {/* Font Options */}
            <FontOptions
              onFontDecrease={() => handleFontSizeUpdate("decrease")}
              onFontIncrease={() => handleFontSizeUpdate("increase")}
            />
            {/* Display Notes */}
            <Button
              onPress={() => setShowNotes(true)}
              variant="light"
              isIconOnly
            >
              <MdOutlineStickyNote2 size={30} />
            </Button>

            <Button onPress={toggleToc} variant="light" isIconOnly>
              <IoMenu size={30} />
            </Button>
          </div>
        </div>
      </div>

      <div className={"h-full relative"} id={wrapper}>
        <div id={container} />

        <Navigator
          side={"left"}
          onClick={() => {
            rendition?.prev();
            hideToc();
          }}
          className={"opacity-0 group-hover:opacity-100"}
        />
        <Navigator
          side={"right"}
          onClick={() => {
            rendition?.next();
            hideToc();
          }}
          className={"opacity-0 group-hover:opacity-100"}
        />
      </div>

      <TableOfContent
        visible={showToc}
        // visible={true}
        data={tableOfContent}
        onClick={handleNavigation}
      />

      <HighlightOptions
        visible={showHighlightOption}
        // onSelect={handleHighlightSelection}
        // onClear={handleOnHighlightClear}
      />
    </div>
  );
};

export default EpubReader;
