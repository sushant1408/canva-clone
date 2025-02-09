import { useEvent } from "react-use";

const useWindowEvent = () => {
  useEvent("beforeunload", (event) => {
    (event || window.event).returnValue = "Are you sure you want to leave?";
  });
};

export { useWindowEvent };
