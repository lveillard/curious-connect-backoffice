export const checkSenders = (store) => {
  //find records with no matching senders
  const errors = store.state.readyToSendRecords.filter(
    (x) => !store.state.senders.some((y) => x.senderAddress === y.sendAsEmail)
  );

  //find records with marching senders: probably there is a better way to do this XD
  const good = store.state.readyToSendRecords.filter((x) =>
    store.state.senders.some((y) => x.senderAddress === y.sendAsEmail)
  );

  //set all not matched to errors
  errors.map((x) =>
    store.actions.mailing.setStatusReadyToSendEmail(x.id, "Error")
  );

  //set matched to ready if they are in error
  good
    .filter((x) => x.status === "Error")
    .map((x) => store.actions.mailing.setStatusReadyToSendEmail(x.id, "Ready"));
};

export const setStatusReadyToSendEmail = (store, id, status) => {
  //boolean is optional, if no boolean => get the contrary
  const current = store.state.readyToSendRecords.find((x) => x.id === id);
  const rest = store.state.readyToSendRecords.filter((x) => x.id !== id);

  //inmutable magic + sort
  store.setState({
    readyToSendRecords: rest
      .concat({
        ...current,
        status: status,
      })
      .slice()
      .sort((a, b) => a.sortNumber - b.sortNumber),
  });
};

export const selectReadyToSendEmail = (store, id, boolean) => {
  //boolean is optional, if no boolean => get the contrary
  const current = store.state.readyToSendRecords.find((x) => x.id === id);
  const rest = store.state.readyToSendRecords.filter((x) => x.id !== id);

  //inmutable magic + sort
  store.setState({
    readyToSendRecords: rest
      .concat({
        ...current,
        isSelected: boolean ? boolean : !current.isSelected,
      })
      .slice()
      .sort((a, b) => a.sortNumber - b.sortNumber),
  });
};

export const selectAllReadyToSendEmail = (store, boolean) => {
  const changed = store.state.readyToSendRecords
    .map((x) => {
      return { ...x, isSelected: boolean };
    })
    .slice()
    .sort((a, b) => a.sortNumber - b.sortNumber);

  store.setState({ readyToSendRecords: changed });
};
