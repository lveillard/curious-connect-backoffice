// config helpers, modals, subviews and toggles

export const setConfig = (store, config, value) => {
  //if a value is provided puts a value on the config thing, if not, toggles the current (for boolean)
  store.setState({
    config: {
      ...store.state.config,
      [config]: value ? value : !store.state.config[config],
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
