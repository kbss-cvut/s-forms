import { useEffect } from "react";

function useScrollToElement({
  id,
  classNames = [],
  scrollOptions = { behavior: "smooth" },
  highlightClass = "text-danger",
}) {
  useEffect(() => {
    let element = null;

    if (id) {
      element = document.getElementById(id);
    }

    if (!element && classNames.length > 0) {
      for (const className of classNames) {
        const elements = document.getElementsByClassName(className);
        if (elements.length > 0) {
          element = elements[0];
          break;
        }
      }
    }

    if (element) {
      element.scrollIntoView(scrollOptions);
      if (highlightClass) {
        element.classList.add(highlightClass);
      }
    }
  }, [id, classNames, scrollOptions, highlightClass]);
}

export default useScrollToElement;
