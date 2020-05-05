import Airtable from "airtable";
import { StrictMode } from "react";

var base = new Airtable({
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
}).base("apptv83SksACULEvd");

export const getStudents = (store) => {
  store.setState({ isLoading: { ...store.state.isLoading, airtable: true } });

  let students = [];

  base("Students")
    .select({
      //filterByFormula: "From = 'jean.richard.loubacky@gmail.com'",
      // Selecting the first 3 records in Preparation:
      maxRecords: 100,
      view: "Students",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        let pageStudents = records.map((x) => {
          return {
            name: x.get("name"),
            familyName: x.get("familyName"),
            emailSender: x.get("email.address"),
            phone: x.get("phone"),
            age: x.get("birthDate"),
            school: x.get("school.name"),
            formation: x.get("school.formation"),
            emailContent: x
              .get("email.content")
              .replace(/(\r\n|\n|\r)/gm, "\n"),
            emailSignature: x.get("email.signature"),
            files: x.get("cv"),
          };
        });

        //TO-DO find a way to do this in an inmutable way
        students = students.concat(pageStudents);

        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        } else {
          store.setState({
            isLoading: { ...store.state.isLoading, airtable: false },
          });

          store.setState({ students: students });
        }
      }
    );
};

export const updateField = (store, id, field, value) => {
  console.log(id, field, value);
  base("Emails").update(
    [
      {
        id: id,
        fields: {
          [field]: value,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {});
    }
  );
};

export const getReadyToSendEmails = (store, filter) => {
  // loading
  store.setState({
    isLoading: { ...store.state.isLoading, readyToSendRecords: true },
  });

  // as we are refreshing, reset last pack of emails
  store.setState({
    readyToSendRecords: [],
  });

  //reset also state related to last pack of emails
  store.actions.mailing.ReadyToSendSetConfig({
    sendersChecked: false,
    atLeastOneReady: false,
  });

  const selectBase = {
    maxRecords: 100,
    view: "SendBO",
  };

  const formula =
    filter || store.state.currentStudent
      ? "{sender.email} = '" + store.state.currentStudent.emailSender + "'"
      : null;

  const selectFinal = formula
    ? { ...selectBase, ...{ filterByFormula: formula } }
    : selectBase;

  let emails = [];

  base("Emails")
    .select(selectFinal)
    .eachPage(
      function page(records, fetchNextPage) {
        let pageEmails = records.map((x) => {
          return {
            id: x.id,
            status: x.get("status") === "SendBO" ? "Loaded" : x.get("status"),
            errorMessage: x.get("error.message"),
            company: x.get("target.companyName"),
            targetAddress: x.get("target.email"),
            senderAddress: x.get("sender.email")[0],
            senderFullName: x.get("sender.fullName"),
            senderSignature: x.get("sender.signature"),
            emailObject: x.get("email.object"),
            emailContent: x
              .get("email.body")[0]
              .replace(/(\r\n|\n|\r)/gm, "\n"),
            emailAttachments: x.get("email.attachments"),
            lastUpdate: x.get("time.lastUpdate"),
            changedStatus: x.get("time.changedStatus"),
            isSelected: false,
            sortNumber: x.get("sort.number"),
          };
        });

        //TO-DO find a way to do this in an inmutable way
        emails = emails.concat(pageEmails);

        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        } else {
          store.setState({
            isLoading: { ...store.state.isLoading, readyToSendRecords: false },
          });

          store.setState({
            readyToSendRecords: emails
              .slice()
              .sort((a, b) => a.sortNumber - b.sortNumber),
          });
        }
      }
    );
};

export const getSentEmails = (store, filter) => {
  // loading
  store.setState({
    isLoading: { ...store.state.isLoading, sentRecords: true },
  });

  // as we are refreshing, reset last pack of emails
  store.setState({
    sentRecords: [],
  });

  //reset also state related to last pack of emails

  const selectBase = {
    maxRecords: 10000,
    view: "Sent",
  };

  const formula =
    filter || store.state.currentStudent
      ? "{sender.email} = '" + store.state.currentStudent.emailSender + "'"
      : null;

  const selectFinal = formula
    ? { ...selectBase, ...{ filterByFormula: formula } }
    : selectBase;

  let emails = [];

  base("Emails")
    .select(selectFinal)
    .eachPage(
      function page(records, fetchNextPage) {
        let pageEmails = records.map((x) => {
          return {
            id: x.id,
            status: x.get("status"),
            company: x.get("target.companyName"),
            targetAddress: x.get("target.email"),
            senderAddress: x.get("sender.email")[0],
            senderFullName: x.get("sender.fullName"),
            senderSignature: x.get("sender.signature"),
            emailObject: x.get("email.object"),
            emailContent: x
              .get("email.body")[0]
              .replace(/(\r\n|\n|\r)/gm, "\n"),
            emailAttachments: x.get("email.attachments"),
            lastUpdate: x.get("time.lastUpdate"),
            changedStatus: x.get("time.changedStatus"),
            sentTime: x.get("time.sent"),
            threadId: x.get("threadId"),
            sentOld: x.get("time.recentlySent"),
            isSelected: false,
            sortNumber: x.get("sort.number"),
          };
        });

        //TO-DO find a way to do this in an inmutable way
        emails = emails.concat(pageEmails);

        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        } else {
          // put the records in its place
          store.setState({
            sentRecords: emails
              .slice()
              .sort((a, b) => a.sortNumber - b.sortNumber),
          });

          // STOP THE LOADING
          store.setState({
            isLoading: { ...store.state.isLoading, sentRecords: false },
          });

          console.log("records", store.state.sentRecords);

          const sentCount = store.state.sentRecords.length;
          const bounced = store.state.sentRecords.filter(
            (x) => x.status === "Bounced"
          ).length;
          const companies = new Set(
            store.state.sentRecords.map((x) => x.company)
          ).size;

          //calc the 3 metrics
          store.setState({
            sentMetrics: {
              companies: companies,
              bounced: bounced,
              sentCount: sentCount,
            },
          });
        }
      }
    );
};
