import React, { useEffect } from "react";

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import "../assets/css/timeline.css"

import TimeLineData from "./TimeLineData"

import { FaPowerOff, FaChalkboardTeacher, FaPlay, FaVideo, FaWpforms, FaTasks, FaUserGraduate } from 'react-icons/fa';
import { AiOutlineSchedule } from 'react-icons/ai';
import { MdWork } from 'react-icons/md'
import { IoMdColorFilter } from 'react-icons/io'

import API from "../utils/API"
import {
  Card,
  Container,
} from "reactstrap";

import Header from "components/Headers/Header.js";

import { useGlobal } from "../store";





const Tools = () => {


  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    async function fetchMyAPI() {
      //const response = await API.isAuth();
      //const result = globalActions.getUser(response);
    }

    fetchMyAPI();

  }, []);




  return (
    <div>

      TOOLS


    </div >)
}



export default Tools;
