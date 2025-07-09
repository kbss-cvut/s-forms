import { useEffect, useState } from "react";

function useScrollToElement(toScroll) {
  useEffect(() => {
    if (toScroll) {
      let element = document.getElementById(toScroll);

      if (!element) {
        const elements = document.getElementsByClassName(toScroll);
        element = elements.length > 0 ? elements[0] : null;
      }

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.classList.add("text-danger");
      }
    }
  }, [toScroll]);
}

export default useScrollToElement;
