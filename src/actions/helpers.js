export const toByteStream = async (store, file) => {
  let final = null;

  var reader = new FileReader();

  reader.onload = function (event) {
    let fileInfo = {
      name: file.name,
      type: file.type,
      size: Math.round(file.size / 1000) + " kB",
      base64: reader.result,
      file: file,
    };

    // var arrayBuffer = event.target.result,
    //  array = new Uint8Array(arrayBuffer),
    // binaryString = String.fromCharCode.apply(String, array);

    // setFile(binaryString);

    final = fileInfo;
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };

  //reader.readAsArrayBuffer(event.target.files[0]);
  reader.readAsDataURL(file);
  return final;
};
