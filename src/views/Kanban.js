import React, { useEffect, useState } from "react";

import { Button } from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import Board from "react-trello";

//steps:
// 1) Copy Kanban
// 2) Update Admin.js => Import + update variable views
// 3) Update routes in the code server curious-connect-server.herokuapp.com
// 4) grant the route permission to somebody in the mongodb

const data = {
  lanes: [
    {
      id: "1",
      title: "inscris ",
      label: "",

      cards: [
        {
          id: "Card1",
          title: "Pierre Le Mestre",
          description: "",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
          label: "30 mins",
        },
        {
          id: "Card2",
          title: "Louise Collard",
          description: "",
          label: "5 mins",
        },
      ],
    },
    {
      id: "2",
      title: "project pro valide",
      label: "",
      cards: [
        {
          id: "Card3",
          title: "Kennet Pillet ",
          description: "",
          label: "5 mins",
        },
      ],
    },
    {
      id: "3",
      title: "candidature envoyé",
      label: "0/0",
      cards: [
        {
          id: "Card4",
          title: "Pedro Alves",
          description: "",
          label: "30 mins",
        },
      ],
    },
  ],
};

const Kanban = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
  }, []);

  return (
    <>
      <div className="bg-gradient-primary" style={{ height: "80px" }}>
        {" "}
      </div>

      <Board
        laneDraggable={false}
        data={data}
        style={{ background: "#efefec" }}
        laneStyle={{ background: "#efefec" }}
      />
    </>
  );
};

export default Kanban;
