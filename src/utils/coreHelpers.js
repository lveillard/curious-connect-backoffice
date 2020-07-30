import { useEffect, useState } from "react";

const noop = () => {};

export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result.split(/base64,/)[1]);
    };
    fileReader.onerror = () => {
      reject(fileReader.error);
    };
    fileReader.readAsDataURL(file);
  });
};

export const b64DecodeUnicode = (str) => {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
};
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

export const loadJson = async (event) => {
  if (event.target.files) {
    const fileName = event.target.files[0].name;
    try {
      const fileContent = await readFile(event.target.files[0]);
      return JSON.parse(b64DecodeUnicode(fileContent).replace(/NaN/g, "0"))
        .data;
    } catch (error) {
      // Show an error to the user... not a log 😁
      console.log(error);
    }
  }
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
