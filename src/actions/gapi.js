import { gapi } from "gapi-script";

const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send";

function initClient(store) {
  gapi.client
    .init({
      apiKey: process.env.REACT_APP_API_KEY,
      clientId: process.env.REACT_APP_CLIENT_ID,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
      ],
      scope: SCOPES,
    })
    .then(
      function () {
        // Handle the initial sign-in state.
        console.log(
          "isSignedIn",
          gapi.auth2.getAuthInstance().isSignedIn.get()
        );
      },
      function (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
}

export const handleAuth = (store) => {
  gapi.load("client:auth2", initClient);

  gapi.auth2
    .getAuthInstance()
    .signIn()
    .then(
      () => {
        store.setState({ gapiAuthed: true }); // Succès !
      },
      (err) => {
        console.log(err); // Erreur !
      }
    );
};

export const handleSignout = (store) => {
  gapi.auth2
    .getAuthInstance()
    .signOut()
    .then(() => store.setState({ gapiAuthed: false }));
};

export const getStatus = (store) => {
  const status = gapi.auth2.getAuthInstance().isSignedIn.get();
  console.log("status", status);
};

export const getLabels = (store) => {
  gapi.client.gmail.users.labels
    .list({
      userId: "me",
    })
    .then(function (response) {
      var labels = response.result.labels;
      console.log("Labels:");

      if (labels && labels.length > 0) {
        console.log(labels);
      } else {
        console.log("No Labels found.");
      }
    });
};

export const getDraft = (store, id, callback) => {
  var draft = gapi.client.gmail.users.drafts.get({
    userId: "me",
    id: id,
    format: "raw",
  });

  draft.execute((resp) => {
    const byteString = resp.message.raw;
    const enc = new TextEncoder();
    const data = enc.encode(byteString);
    const blob = new Blob([data], { type: "image/png" });
    var url = URL.createObjectURL(blob);
    console.log(byteString);
  });
};
