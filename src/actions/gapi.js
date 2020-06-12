import { gapi, loadAuth2 } from "gapi-script";

const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send";

export const initClient = (store) => {
  gapi.client.init({
    apiKey: process.env.REACT_APP_API_KEY,
    clientId: process.env.REACT_APP_CLIENT_ID,
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
    ],
    scope: SCOPES,
  });
};

export const load = async (store) => {
  try {
    //to-do LOADING thing

    //init the GAPI (not required to log in or check login, but yes for using gapi.client)
    gapi.load("client:auth2", store.actions.gapi.initClient);

    // init auth2 object
    let auth2 = await loadAuth2(process.env.REACT_APP_CLIENT_ID, SCOPES);

    //checking if already logged
    if (auth2.isSignedIn.get()) {
      store.setState({ gapiAuthed: true }); // Succès !
      let auth = auth2;
      store.setState({ auth: auth.currentUser.get() });
      store.setState({ guser: auth.currentUser.get().getBasicProfile() });

      //load senders
      store.actions.gapi.getSenders();

      //to-do LOADING done
    }
  } catch (err) {
    console.log(err);
  }
};

export const handleAuth = async (store) => {
  // first step of auth is already done
  // store.actions.gapi.load(); in tools.js

  try {
    let auth2 = await loadAuth2(process.env.REACT_APP_CLIENT_ID, SCOPES);
    await auth2.signIn();
    store.setState({ gapiAuthed: true }); // Succès !
    store.setState({ auth: auth2 });
    store.setState({ guser: auth2.currentUser.get().getBasicProfile() });
  } catch (err) {
    console.log(err);
  }
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

/* export const getStatus = (store) => {
  const status = gapi.auth2.getAuthInstance().isSignedIn.get();
  console.log("status", status);
}; */

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

export const getSenders = async (store) => {
  let response = await store.actions.gapi.getSendersPromise();
  let senders = response.result.sendAs;
  store.setState({ senders: senders });
};

export const getSendersPromise = (store, raw) => {
  return new Promise((resolve, reject) => {
    gapi.client.gmail.users.settings.sendAs
      .list({
        userId: "me",
      })
      .then((answer) => resolve(answer));
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

export const sendMessagePromise = (store, raw) => {
  return new Promise((resolve, reject) => {
    store.actions.gapi.sendMessage(raw, (answer) => {
      resolve(answer);
    });
  });
};

export const getThread = (store, id) => {
  return new Promise((resolve, reject) => {
    var thread = gapi.client.gmail.users.threads.get({
      userId: "me",
      id: id,
    });

    thread.execute((answer) => {
      resolve(answer);
    });
  });
};
