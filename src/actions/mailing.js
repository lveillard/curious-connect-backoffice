import { SERVER_URL } from "../utils/constants";
import MIMEText from "mimetext";
import axios from "axios";

export const ReadyToSendSetConfig = (store, object) => {
  const current = store.state.readyToSendConfig;
  const changed = { ...current, ...object };

  store.setState({
    readyToSendConfig: changed,
  });
};

export const checkSenders = (store) => {
  if (!store.state.senders) {
    console.log("No senders, loading...");
    // then try to load them
    try {
      store.actions.gapi.getSenders();
    } catch (err) {
      console.log("Error loading senders");
    }
    return false;
  }

  //find records with no matching senders
  const errors = store.state.readyToSendRecords.filter(
    (x) =>
      !store.state.senders.some(
        (y) =>
          x.senderAddress.toLowerCase().trim() ===
          y.sendAsEmail.toLowerCase().trim()
      )
  );

  //find records with marching senders: probably there is a better way to do this XD
  const good = store.state.readyToSendRecords.filter((x) =>
    store.state.senders.some(
      (y) =>
        x.senderAddress.toLowerCase().trim() ===
        y.sendAsEmail.toLowerCase().trim()
    )
  );

  console.log("readyToSend", store.state.readyToSendRecords);
  console.log("good", good);
  console.log("errors", errors);

  //set all not matched to errors
  errors.map((x) =>
    store.actions.mailing.setRecordProperty(x.id, {
      status: "Error",
      errorMessage: "Unmatched sender",
    })
  );

  //set matched to ready if they are in error or loaded
  good
    .filter((x) => x.status === "Error" || x.status === "Loaded")
    .map((x) =>
      store.actions.mailing.setRecordProperty(x.id, {
        status: "Ready",
      })
    );

  //set checkedSenders to true
  store.actions.mailing.ReadyToSendSetConfig({ sendersChecked: true });

  // check if at least one is ready

  if (
    store.state.readyToSendRecords.filter((x) => x.status === "Ready").length >
    0
  ) {
    store.actions.mailing.ReadyToSendSetConfig({ atLeastOneReady: true });
  }
};

export const setPropertyReadyToSendEmail = (
  store,
  id,
  property,
  propertyValue
) => {
  // so basically this method changes a given property
  // for bolean properties you can either give the boolean value or don't give nothing
  // if nothing is provided, the boolean just switches

  const current = store.state.readyToSendRecords.find((x) => x.id === id);
  const rest = store.state.readyToSendRecords.filter((x) => x.id !== id);

  //inmutable magic + sort
  store.setState({
    readyToSendRecords: rest
      .concat({
        ...current,
        [property]: propertyValue ? propertyValue : !current[property],
      })
      .slice()
      .sort((a, b) => a.sortNumber - b.sortNumber),
  });
};

export const setRecordProperty = (store, id, object) => {
  // so basically this method changes a given property
  // for bolean properties you can either give the boolean value or don't give nothing
  // if nothing is provided, the boolean just switches

  const readyToSend = store.state.readyToSendRecords.find((x) => x.id === id);
  const restReadyToSend = store.state.readyToSendRecords.filter(
    (x) => x.id !== id
  );

  const sent = store.state.sentRecords.find((x) => x.id === id);
  const restSent = store.state.sentRecords.filter((x) => x.id !== id);

  if (readyToSend) {
    //inmutable magic + sort
    store.setState({
      readyToSendRecords: restReadyToSend
        .concat({
          ...readyToSend,
          ...object,
        })
        .slice()
        .sort((a, b) => a.sortNumber - b.sortNumber),
    });
  }

  if (sent) {
    //inmutable magic + sort
    store.setState({
      sentRecords: restSent
        .concat({
          ...sent,
          ...object,
        })
        .slice()
        .sort((a, b) => a.sortNumber - b.sortNumber),
    });
  }
};

export const selectAllReadyToSendEmail = (store, boolean) => {
  const selectable = store.state.readyToSendRecords.filter(
    (x) => x.status === "Ready"
  );
  const unselectable = store.state.readyToSendRecords.filter(
    (x) => x.status !== "Ready"
  );

  const changed = selectable.map((x) => {
    return { ...x, isSelected: boolean };
  });

  //inmutable magic + sort
  store.setState({
    readyToSendRecords: unselectable
      .concat(changed)
      .slice()
      .sort((a, b) => a.sortNumber - b.sortNumber),
  });

  console.log(
    "selected",
    store.state.readyToSendRecords.filter((x) => x.isSelected === true)
  );
};

export const prepareAirtableFile = (store, airtableFiles) => {
  const firstFile = airtableFiles[0];

  console.log("file", firstFile);

  /* const fileInfo = {
    name: firstFile.filename,
    type: firstFile.type,
    size: firstFile.size,
  }; */

  return null;
};

export const prepareMsg = async (
  store,
  sender,
  recipient,
  subject,
  message,
  attached
) => {
  const Msg = new MIMEText();
  Msg.setSender(sender);
  Msg.setRecipient(recipient);
  Msg.setSubject(subject);
  Msg.setMessage(message);

  if (attached && attached.length > 0 && attached[0].url) {
    //airtable file

    const answer = await axios.get(attached[0].url, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    });

    const base64 = window.btoa(
      new Uint8Array(answer.data).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
      }, "")
    );

    const attatchment = {
      type: attached[0].type,
      size: attached[0].size,
      filename: attached[0].filename,
      base64Data: base64,
    };
    Msg.setAttachments([attatchment]);
  } else {
    if (attached) {
      //direct file
      const attatchment = {
        type: attached.type,
        filename: attached.name,
        base64Data: attached.base64.substring(attached.base64.search(",") + 1),
      };
      console.log("attachment", attatchment);

      Msg.setAttachments([attatchment]);
    }
  }
  return Msg.asRaw();
};

export const sendCallback = (store, answer, id) => {
  if (answer.error) {
    //on error actions
    console.log(answer.error.message);

    store.actions.mailing.setRecordProperty(id, {
      status: "Error",
      errorMessage: answer.error.message,
    });

    //update airtable
    store.actions.airtable.updateField(
      id,
      "error.message",
      answer.error.message
    );
    store.actions.airtable.updateField(id, "status", "Error");
    return { Status: "Error", error: answer.error.message, item: answer };
  } else {
    //on success actions
    store.actions.mailing.setRecordProperty(id, {
      status: "Sent",
      threadId: answer.threadID,
    });

    //we change the record

    store.actions.airtable.updateField(id, "threadId", answer.id);
    store.actions.airtable.updateField(id, "status", "Sent");

    //refresh only that record

    // return answer
    return { Status: "Sent", item: answer };
  }
};

// please don't forget to modify also the send methods with the send button in bulkEmail.js
//To-do unify both
export const sendEmailsBulk = async (store) => {
  store.setState({
    isLoading: { ...store.state.isLoading, bulkSender: true },
  });

  //get all ready messages
  const bulkReady = store.state.readyToSendRecords.filter(
    (x) => x.status === "Ready" && x.isSelected === true
  );

  //set count to 0
  store.setState({
    isProcessing: {
      ...store.state.isProcessing,
      bulkSender: {
        current: 0,
        total: bulkReady.length,
      },
    },
  });

  if (bulkReady.length > 0) {
    for (let x of bulkReady) {
      // put the message on loading
      store.actions.mailing.setRecordProperty(x.id, {
        status: "Sending",
      });

      // name structure if fullName provided
      const senderNamedAddress = x.senderFullName
        ? x.senderFullName + "<" + x.senderAddress + ">"
        : x.senderAddress;

      //body structure & attach signature
      const contentBR = x.emailContent.replace(/(\r\n|\n|\r)/gm, "<br>");
      const greySignature =
        '<div style="color: #777777;">' +
        "<br/> <br/>--- <br/>" +
        x.senderSignature +
        "</div>";
      const signatured = contentBR + greySignature;

      console.log("precall", x.id);

      const MSG = await store.actions.mailing.prepareMsg(
        senderNamedAddress,
        x.targetAddress,
        x.emailObject,
        signatured,
        x.emailAttachments
      );
      const answer = await store.actions.gapi.sendMessagePromise(MSG);

      const cb = store.actions.mailing.sendCallback(answer, x.id);

      //update count +1
      store.setState({
        isProcessing: {
          ...store.state.isProcessing,
          bulkSender: {
            current: store.state.isProcessing.bulkSender.current + 1,
            total: bulkReady.length,
          },
        },
      });

      console.log("reuslt:", cb);
      // TO-do: recharge the status to check that it went fine?
    }
  }

  store.setState({
    isLoading: { ...store.state.isLoading, bulkSender: false },
  });
};

export const checkBounced = async (store, record) => {
  //show loading
  store.actions.mailing.setRecordProperty(record.id, {
    status: "Checking",
  });

  const oldStatus = store.state.sentRecords.filter((x) => x.id === record.id)
    .status;

  // if no thread, no bounced
  if (!record.threadId) {
    store.actions.mailing.setRecordProperty(record.id, {
      status: "Error",
      errorMessage: "no thread id",
    });

    return "no threadId";
  }

  // get thread
  const a = await store.actions.gapi.getThread(record.threadId);
  // check if bounced
  if (!a.messages[1]) {
    store.actions.mailing.setRecordProperty(record.id, {
      status: "Sent",
    });

    return "no answer";
  } else {
    //if limits => set as limits, not bounced
    if (a.messages[1].labelIds.includes("Label_5336612657409450789")) {
      let oldStatus = store.state.sentRecords.filter((x) => x.id === record.id)
        .status;

      // update state to limits in local
      store.actions.mailing.setRecordProperty(record.id, {
        status: "Limits",
      });

      // update field in airtable only if it is not already as limits
      if (oldStatus !== "Limits") {
        store.actions.airtable.updateField(record.id, "status", "Limits");
      }
      return "limits";
    } else {
      //if bounced => set as bounced
      if (a.messages[1].labelIds.includes("Label_5687749278126997160")) {
        // update state to bounced in local
        store.actions.mailing.setRecordProperty(record.id, {
          status: "Bounced",
        });

        // update field in airtable only if it is not already as bounced
        if (oldStatus !== "Bounced") {
          store.actions.airtable.updateField(record.id, "status", "Bounced");
        }
        return "bounced";
      } else {
        store.actions.mailing.setRecordProperty(record.id, {
          status: "Sent",
        });

        return "answerNotBounced";
      }
    }
  }
};

export const checkAllBounced = async (store) => {
  //performance checks:
  var start = Date.now();

  store.setState({
    isLoading: { ...store.state.isLoading, bounceChecker: true },
  });

  var sentRecords = store.state.sentRecords;

  //total to be checked:
  store.setState({
    isProcessing: {
      ...store.state.isProcessing,
      bounceChecker: { current: 0, total: sentRecords.length },
    },
  });

  //count
  var count = 0;

  console.log("store", store.state);

  let checkedArray = await Promise.all(
    sentRecords.map(async (x) => {
      try {
        // check if bounced
        let isBounced = await store.actions.mailing.checkBounced(x);

        //
        count++;

        //once is checked, update the counter
        //for performance, update only each 15 checks
        count % 20 === 0 &&
          store.setState({
            isProcessing: {
              ...store.state.isProcessing,
              bounceChecker: {
                current: count,
                total: sentRecords.length,
              },
            },
          });
        return isBounced;
      } catch (e) {
        console.log("Error en:", x);
        console.log(e);
      }
    })
  );
  console.log(checkedArray);

  //performance checks
  var delta = Date.now() - start;
  console.log("TIMER: Bounce checker:", Math.floor(delta / 1000), " secs");
  store.setState({
    isLoading: { ...store.state.isLoading, bounceChecker: false },
  });
};

export const getTemplates = async (store) => {
  const token = localStorage.getItem("token");
  // let url = `${SERVER_URL}/templates/all`;

  if (!token) {
    return false;
  } else {
    try {
      const answer = await axios.get(`${SERVER_URL}/templates/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const { data } = answer;
      store.setState({
        templates: data,
      });
      return true;
    } catch (err) {
      console.log("bad token:", err);
      localStorage.clear();
      return false;
    }
  }
};
