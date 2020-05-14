import { RiChat1Line } from "react-icons/ri";

const templater = ["N1", "N1.F1", "NI1.F1", "NI1.F1.F2", "N1.FI1", "N1.F1.F2"];

export const setProp = (store, prop, value) => {
  //value is optional. If you want to use it as a toggle, just give the prop and it will automatically toggle
  store.setState({
    mailGenerator: {
      ...store.state.mailGenerator,
      [prop]: value ? value : !store.state.mailGenerator[prop],
    },
  });
};

export const generate = (
  store,
  name,
  familyName,
  domain,
  activeDotVariator
) => {
  //check conditions

  //split the info.
  //Note:  lowercase, we will ignore that sometimes, name@domain.xyz != Name@domain.xyz
  //Note2: First replace removes accesnts, second replace removes weird chars
  const names = name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z_-\s]/g, "")
    .replace(/[_]/g, "-")
    .split(" ");

  const familyNames = familyName
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z_-\s]/g, "")
    .replace(/[-_]/g, " ")
    .split(" ");

  //words => the names / family names to be objectified
  //code => just a letter or something to name the prop
  const elementGenerator = function (words, code) {
    // split the words
    const props = words.map((x, index) => {
      return {
        [code + (index + 1)]: x,
        [code + "I" + (index + 1)]: x.substring(0, 1),
      };
    });
    const object = Object.assign(...props);

    return object;
  };

  // for composed names like Jean-Philippe
  const composedVariator = (word) => {
    //for example Jean.philippe => Jean, JeanPhilippe, JPhilippe ,JP, JeanP, Philippe
    const composedTemplater = [
      "C1",
      "C1.C2",
      "CI1.C2",
      "CI1.CI2",
      "C1.CI2",
      "C2",
    ];

    const composed = word.split("-");
    const composedElements = elementGenerator(composed, "C");

    const composedList = [word].concat(
      composedTemplater.map((x) =>
        x
          .split(".")
          .map((y) => composedElements[y])
          .join(".")
      )
    );

    const dotComposedList = composedList.concat(
      composedTemplater.map((x) =>
        x
          .split(".")
          .map((y) => composedElements[y])
          .join("")
      )
    );
    console.log("composed", composedList);

    return activeDotVariator ? dotComposedList : composedList;
  };

  const elements = {
    ...elementGenerator(names, "N"),
    ...elementGenerator(familyNames, "F"),
  };

  const translate = (elem) => {
    console.log("\n");
    console.log("ELEM:", elem);
    console.log("elements", elements);
    const trozos = elem.split(".");
    console.log("trozos", trozos);

    const traducido = trozos
      .map((y) => elements[y])
      .filter((y) => y !== undefined);

    console.log("traducido", traducido);

    const checked = traducido.map((z) =>
      z.includes("-") ? composedVariator(z) : [z]
    );
    console.log("checked", checked);

    const combined = () => {
      switch (checked.length) {
        case 0:
          return null;

        case 1:
          let combi = checked[0].flatMap((d) => {
            return { value: d, label: elem };
          });
          return combi;

        case 2: {
          let combi = checked[0].flatMap((d) =>
            checked[1].map((v) => {
              return { value: d + v, label: elem };
            })
          );
          let dotCombi = combi.concat(
            checked[0].flatMap((d) =>
              checked[1].map((v) => {
                return { value: d + "." + v, label: elem, dot: true };
              })
            )
          );

          return activeDotVariator ? dotCombi : combi;
        }
        case 3: {
          let combi = checked[0]
            .flatMap((d) => checked[1].map((v) => d + v))
            .flatMap((item) =>
              checked[2].map((vi) => {
                return { value: item + vi, label: elem };
              })
            );

          let dotCombi = combi.concat(
            checked[0]
              .flatMap((d) => checked[1].map((v) => d + "." + v))
              .flatMap((item) =>
                checked[2].map((vi) => {
                  return { value: item + "." + vi, label: elem, dot: true };
                })
              )
          );
          return activeDotVariator ? dotCombi : combi;
        }
        default: {
          return null;
        }
      }
    };

    console.log("combined", combined());

    return combined();
  };

  const list = templater.map((x) =>
    translate(x).map((y) => {
      return { value: y.value + "@" + domain, label: y.label, dot: y.dot };
    })
  );
  const unique = [...new Set([].concat(...list))];

  store.actions.generator.setProp("emailList", unique);
};
