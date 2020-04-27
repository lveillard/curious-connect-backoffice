export const toggleSidebar = (store) => {
  store.setState({
    config: {
      ...store.state.config,
      hiddenSidebar: !store.state.config.hiddenSidebar,
    },
  });
};

export const setSize = (store, size) => {
  store.setState({
    size: size,
  });
};
