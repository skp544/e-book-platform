import { Book, Rendition } from "epubjs";
import { useEffect, useState } from "react";
import Navigator from "./Navigator.tsx";
import LoadingIndicator from "./LoadingIndicator.tsx";
import TableOfContent, { BookNavList } from "./TableOfConents.tsx";
import { Highlight, LocationChangedEvent, RelocatedEvent } from "../../types";
import { Button } from "@heroui/react";
import { IoMenu } from "react-icons/io5";
import { MdOutlineStickyNote2 } from "react-icons/md";
import ThemeOptions, { ThemeModes } from "./ThemeOptions.tsx";
import FontOptions from "./FontOptions.tsx";
import HighlightOptions from "./HighlightOptions.tsx";
import { debounce } from "../../helpers";
import NotesModal from "./NotesModal.tsx";

interface Props {
  url?: string;
  title?: string;
  lastLocation?: string;
  highlights: Highlight[];
  onHighlight(data: Highlight): void;
  onLocationChanged(location: string): void;
  onHighlightClear(selection: string): void;
}

const container = "epub_container";
const wrapper = "epub_wrapper";
const DARK_THEME = {
  body: {
    color: "#f8f8ea !important",
    background: "#2B2B2B !important",
  },
  a: {
    color: "#f8f8ea !important",
  },
};
const LIGHT_THEME = {
  body: {
    color: "#000 !important",
    background: "#fff !important",
  },
  a: {
    color: "blue !important",
  },
};

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

const applyHighlights = async (
  rendition: Rendition,
  highlights: Highlight[],
) => {
  highlights.forEach(({ selection, fill }) => {
    rendition.annotations.remove(selection, "highlight");
    rendition.annotations.highlight(
      selection,
      undefined,
      undefined,
      undefined,
      {
        fill,
      },
    );
  });
};

const EpubReader = ({
  url,
  title,
  highlights,
  lastLocation,
  onHighlight,
  onHighlightClear,
  onLocationChanged,
}: Props) => {
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

  const handleOnHighlightClear = () => {
    if (!rendition) return;

    rendition.annotations.remove(selectedCfi, "highlight");
    setShowHighlightOptions(false);
    onHighlightClear(selectedCfi);
  };

  const handleHighlightSelection = (fill: string) => {
    if (!rendition) return;

    const newHighlight = { fill, selection: selectedCfi };
    applyHighlights(rendition, [newHighlight]);
    setShowHighlightOptions(false);
    onHighlight(newHighlight);
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

  const handleOnNotesClick = (path: string) => {
    if (!locationBeforeNoteOpen)
      setLocationBeforeNoteOpen(settings.currentLocation);
    handleNavigation(path);
  };

  useEffect(() => {
    if (!rendition) return;
    // basic book styling
    rendition.themes.fontSize(settings.fontSize + "px");

    rendition.on("locationChanged", () => {
      applyHighlights(rendition, highlights);
    });

    rendition.on("relocated", (evt: RelocatedEvent) => {
      setSettings((old) => ({ ...old, currentLocation: evt.start.cfi }));
    });
  }, [rendition, highlights, settings.fontSize]);

  useEffect(() => {
    if (!url) return;

    const book = new Book(url);
    const { height, width } = getElementSize(wrapper);
    const rendition = book.renderTo(container, {
      width,
      height,
    });

    if (lastLocation) rendition.display(lastLocation);
    else rendition.display();

    // Registering The Theme Options
    rendition.themes.register("light", LIGHT_THEME);
    rendition.themes.register("dark", DARK_THEME);

    const debounceSetShowHighlightOption = debounce(
      setShowHighlightOptions,
      3000,
    );
    const debounceUpdateLoading = debounce(setLoading, 500);

    // Let's listen if resized is finished
    rendition.on("resized", () => {
      debounceUpdateLoading(false);
    });

    // Let's fire the on click if we click inside the book
    rendition.on("click", () => {
      hideToc();
    });

    // Let's listen to the text selection
    rendition.on("selected", (cfi: string) => {
      setShowHighlightOptions(true);
      setSelectedCfi(cfi);
      debounceSetShowHighlightOption(false);
    });

    // Let's listen to the highlight click
    rendition.on("markClicked", (cfi: string) => {
      setShowHighlightOptions(true);
      setSelectedCfi(cfi);
      debounceSetShowHighlightOption(false);
    });

    rendition.on("displayed", () => {
      updatePageCounts(rendition);
    });
    rendition.on("locationChanged", (evt: LocationChangedEvent) => {
      onLocationChanged(evt.start);
      updatePageCounts(rendition);
    });

    loadTableOfContent(book)
      .then(setTableOfContent)
      .finally(() => {
        setLoading(false);
      });

    setRendition(rendition);

    return () => {
      if (book) book.destroy();
    };
  }, [url, lastLocation, onLocationChanged]);

  useEffect(() => {
    if (!rendition) return;

    const handleResize = () => {
      setLoading(true);

      const { height, width } = getElementSize(wrapper);
      rendition.resize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [rendition]);

  return (
    <div className="dark:bg-book-dark dark:text-book-dark group flex h-screen flex-col">
      <LoadingIndicator visible={loading} />

      <div className="flex h-14 items-center opacity-0 shadow-md transition group-hover:opacity-100">
        <div className="max-w-3xl pl-5 md:mx-auto md:pl-0">
          <h1 className="line-clamp-1 text-large font-semibold">{title}</h1>
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

      <div className={"relative h-full"} id={wrapper}>
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
        onSelect={handleHighlightSelection}
        onClear={handleOnHighlightClear}
      />

      <NotesModal
        book={rendition?.book}
        notes={highlights.map(({ selection }) => selection)}
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        onNoteClick={handleOnNotesClick}
      />

      <div className="flex h-10 items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex-1 text-center">
          <p>Page {`${page.start} - ${page.total}`}</p>
        </div>

        {locationBeforeNoteOpen ? (
          <button
            onClick={() => {
              setLocationBeforeNoteOpen("");
              handleNavigation(locationBeforeNoteOpen);
            }}
          >
            Go to Previous Location
          </button>
        ) : null}

        {page.start === page.end ? null : (
          <div className="flex-1 text-center">
            <p>Page {`${page.end} - ${page.total}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpubReader;
