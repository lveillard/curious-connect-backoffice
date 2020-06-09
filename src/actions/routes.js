export const getRouteName = (store, location) => {
  if (store.state.user) {
    try {
      //TO-DO not working with children routes
      return store.state.user.routes.find(
        (x) => x.layout + x.path === location.pathname
      ).name;
    } catch (err) {
      // while loading location.pathname is incomplete so we will get some errors
      // console.log("No rute name")
    }
  }
};

export const setRoute = (store, location) => {
  const route = store.actions.routes.getRouteName(location);
  store.setState({ currentRoute: route });
};

/* export const setCurrentStudent = (store, selected) => {
  if (selected === null) {
    store.setState({ selectedStudent: null });
    store.setState({ currentStudent: null });
    return;
  }

  store.setState({ selectedStudent: selected });

  const data = store.state.students.find(
    (x) => x.emailSender === selected.value
  );

  store.setState({ currentStudent: data });
};
*/

export const setCurrentProgram = (store, selected) => {
  if (selected === null) {
    store.actions.bulkSender.setCurrentStudent(null);
    store.actions.airtable.getStudents();
    store.setState({ currentProgram: null });

    return;
  }

  //when selecting a program, remove current student
  store.actions.bulkSender.setCurrentStudent(null);

  //then activate selected program
  store.setState({ currentProgram: selected });

  //and get all the students
  store.actions.airtable.getStudents();
};
