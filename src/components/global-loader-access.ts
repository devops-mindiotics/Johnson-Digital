type LoaderControls = {
  showLoader: () => void;
  hideLoader: () => void;
} | null;

let loaderRef: LoaderControls = null;

export const setLoadingRef = (ref: LoaderControls) => {
  loaderRef = ref;
};

export const getLoadingRef = (): LoaderControls => loaderRef;
