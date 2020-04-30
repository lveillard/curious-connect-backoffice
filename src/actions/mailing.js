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
    store.actions.mailing.setBulkPropertyReadyToSendEmail(x.id, {
      status: "Error",
      errorMessage: "Unmatched sender",
    })
  );

  //set matched to ready if they are in error or loaded
  good
    .filter((x) => x.status === "Error" || x.status === "Loaded")
    .map((x) =>
      store.actions.mailing.setBulkPropertyReadyToSendEmail(x.id, {
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

export const setBulkPropertyReadyToSendEmail = (store, id, object) => {
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
        ...object,
      })
      .slice()
      .sort((a, b) => a.sortNumber - b.sortNumber),
  });
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
};

export const prepareAirtableFile = (store, airtableFiles) => {
  const firstFile = airtableFiles[0];

  console.log("file", firstFile);

  const fileInfo = {
    name: firstFile.filename,
    type: firstFile.type,
    size: firstFile.size,
  };

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

  if (attached.length > 0 && attached[0].url) {
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

    store.actions.mailing.setBulkPropertyReadyToSendEmail(id, {
      status: "Error",
      errorMessage: answer.error.message,
    });
  } else {
    //on success actions
    store.actions.mailing.setBulkPropertyReadyToSendEmail(id, {
      status: "Sent",
      threadId: answer.threadID,
    });

    //we change the record

    store.actions.airtable.updateField(id, "threadId", answer.id);
    store.actions.airtable.updateField(id, "status", "Sent");

    //refresh only that record
  }
};

// please don't forget to modify also the send methods with the send button in bulkEmail.js
//To-do unify both
export const sendEmailsBulk = async (store) => {
  //get all ready messages
  const bulkReady = store.state.readyToSendRecords.filter(
    (x) => x.status === "Ready" && x.isSelected === true
  );

  if (bulkReady.length > 0) {
    for (let x of bulkReady) {
      // put the message on loading
      store.actions.mailing.setBulkPropertyReadyToSendEmail(x.id, {
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

      // TO-do: recharge the status to check that it went fine?
    }
  }
};
