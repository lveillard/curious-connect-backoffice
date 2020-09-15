//to-do the post maybe should be here actually, as well as the scoring requests

export const getFilterPacks = async (store) => {
  const token = localStorage.getItem("token");
  // let url = `${SERVER_URL}/templates/all`;

  if (!token) {
    return false;
  } else {
    try {
      const { res } = await store.actions.server.GET("/scoring/filters/all");
      //console.log("answer", res);
      const { data } = await res;

      if (!data || data.answerType === "fail") {
        return false;
      }
      //console.log("data", data);
      store.setState({
        scoring: {
          ...store.state.scoring,
          filterPacks: data,
          filterPackList: data.map((x, key) => {
            return { value: key, label: x.name };
          }),
        },
      });
      return true;
    } catch (err) {
      console.log("bad token:", err);
      localStorage.clear();
      return false;
    }
  }
};

export const setSelectedFilterPack = async (store, selected) => {
  store.setState({
    scoring: {
      ...store.state.scoring,
      selectedFilterPack: selected,
    },
  });
};
