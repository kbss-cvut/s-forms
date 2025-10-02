import { useEffect } from "react";

function useScrollToElement({
  id,
  dataAttributes = [],
  scrollOptions = { behavior: "smooth" },
  highlightClass = "text-danger",
}) {
  useEffect(() => {
    let element = null;

    if (id) {
      element = document.getElementById(id);
    }

    if (!element && Object.keys(dataAttributes).length > 0) {
      const selector = Object.entries(dataAttributes)
        .map(([key, value]) => `[data-${key}="${value}"]`)
        .join("");
      element = document.querySelector(selector);
    }

    if (element) {
      element.scrollIntoView(scrollOptions);
      if (highlightClass) {
        element.classList.add(highlightClass);
      }
    }
  }, [id, dataAttributes, scrollOptions, highlightClass]);
}

export default useScrollToElement;
