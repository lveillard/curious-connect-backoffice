import { useEffect, useState } from "react";

const noop = () => {};

export const useFileReader = (options) => {
  const { method = "readAsText", onload: onloadHook = noop } = options;
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader(file);
    reader.onloadstart = () => {
      setLoading(true);
    };
    reader.onloadend = () => {
      setLoading(false);
    };
    reader.onload = (e) => {
      setResult(e.target.result);
      onloadHook(e.target.result);
    };
    reader.onError = (e) => {
      setError(e);
    };
    try {
      reader[method](file);
    } catch (e) {
      setError(e);
    }
  }, [file]);

  return [{ result, error, file, loading }, setFile];
};

export const objectMap = () => {
  Object.defineProperty(Object.prototype, "oMap", {
    enumerable: false,
    value: function (mapEntriesCallback) {
      return Object.fromEntries(
        Object.entries(this).map(([key, value], index) => [
          key,
          mapEntriesCallback(value, key, this, index),
        ])
      );
    },
  });
};

export const objectFilter = () => {
  Object.defineProperty(Object.prototype, "oFilter", {
    enumerable: false,
    value: function (predicate) {
      return Object.keys(this)
        .filter((key) => predicate(this[key]))
        .reduce((res, key) => ((res[key] = this[key]), res), {});
    },
  });
};

export const StringClean = () => {
  Object.defineProperty(String.prototype, "sClean", {
    enumerable: false,
    value: function () {
      return this.toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z_-\s]/g, "")
        .replace(/[_]/g, "-");
    },
  });
};
