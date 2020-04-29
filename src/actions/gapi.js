import { gapi } from "gapi-script";

const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send";

export const initClient = (store) => {
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
        //Listen for sign-in changes
        gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
          if (isSignedIn) {
            store.setState({ isSignedIn: true });
          } else {
            store.setState({ isSignedIn: true });
          }
        });

        // Handle the initial sign-in state.

        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          store.setState({ isSignedIn: true });
        } else {
          store.setState({ isSignedIn: true });
        }
      },
      function (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
};

export const load = (store) => {
  /*
    const authy = async () => {
    let auth = await loadAuth2(process.env.REACT_APP_CLIENT_ID, SCOPES);
    console.log(auth.isSignedIn.get());
    store.setState({ auth: auth });
  };
*/

  gapi.load("client:auth2", store.actions.gapi.initClient);

  //check if it is already signed in order to dodge login
  //authy();
};

export const handleAuth = (store) => {
  // first step of auth is already done
  // store.actions.gapi.load(); in tools.js

  gapi.auth2
    .getAuthInstance()
    .signIn()
    .then(
      () => {
        store.setState({ gapiAuthed: true }); // Succès !
        let auth = gapi.auth2.getAuthInstance();
        store.setState({ auth: auth });
        store.setState({ guser: auth.currentUser.get().getBasicProfile() });

        //getSenders
        store.actions.gapi.getSenders();
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
    .then(() => {
      store.setState({ gapiAuthed: false });
      store.setState({ auth: undefined });
      store.setState({ guser: undefined });
    });
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
    //const enc = new TextEncoder();
    //const data = enc.encode(byteString);
    //const blob = new Blob([data], { type: "image/png" });
    //var url = URL.createObjectURL(blob);
    console.log(byteString);
  });
};

export const getSenders = (store, senders) => {
  gapi.client.gmail.users.settings.sendAs
    .list({
      userId: "me",
    })
    .then(function (response) {
      let senders = response.result.sendAs;
      store.setState({ senders: senders });
    });
};

export const sendMessage = (store, raw, callback) => {
  //sending the message

  var request = gapi.client.gmail.users.messages.send({
    userId: "me",
    resource: {
      raw: window
        .btoa(unescape(encodeURIComponent(raw)))
        .replace(/\//g, "_")
        .replace(/\+/g, "-"),
    },
  });
  request.execute((answer) => callback(answer));
};
