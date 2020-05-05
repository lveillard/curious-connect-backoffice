// config helpers, modals, subviews and toggles

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
    config: {
      ...store.state.config,
      size: size,
    },
  });
};

export const setToggleView = (store, toggle, boolean) => {
  store.setState({
    toggleView: {
      ...store.state.config,
      [toggle]: boolean ? boolean : !store.state.toggleView[toggle],
    },
  });
};

export const setSubView = (store, toggle, value) => {
  store.setState({
    subView: {
      ...store.state.subView,
      [toggle]: value,
    },
  });
};
