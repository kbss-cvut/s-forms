import { useEffect, useState } from "react";

function useScrollToElementById(startingId) {
  useEffect(() => {
    if (startingId) {
      const element = document.getElementById(startingId);
      if (element) {
        element.scrollIntoView();
        element.classList.add("text-danger");
      }
    }
  }, [startingId]);
}

export default useScrollToElementById;
