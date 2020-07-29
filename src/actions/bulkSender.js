export const setCurrentStudent = (store, selected) => {
  if (selected === null) {
    let oldBulk = store.state.bulkSender;
    let newBulk = {
      ...oldBulk,
      ...{ selectedStudent: null, currentStudent: null }
    };
    store.setState({ bulkSender: newBulk });
    return;
  }

  let oldBulk = store.state.bulkSender;

  const data = store.state.students.find(x => x.emailSender === selected.value);

  let newBulk = {
    ...oldBulk,
    ...{ selectedStudent: selected, currentStudent: data }
  };
  store.setState({ bulkSender: newBulk });
};
