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





const TimeLine = () => {


  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    async function fetchMyAPI() {
      //const response = await API.isAuth();
      //const result = globalActions.getUser(response);
    }

    fetchMyAPI();

  }, []);


  const icons = {
    filter: <IoMdColorFilter />, graduate: <FaUserGraduate />, power: <FaPowerOff />, work: <MdWork />, teacher: <FaChalkboardTeacher />, task: <FaTasks />, form: <FaWpforms />, video: <FaVideo />, schedule: <AiOutlineSchedule />, play: <FaPlay />
  }
  return (<div>
    <Header />

    <Container className="mt--7" fluid >
      <Card>
        <VerticalTimeline>
          {TimeLineData.map((x) => {
            return < VerticalTimelineElement key={x.title}
              contentStyle={{ borderTop: "4px solid", borderColor: x.iconStyle.background, background: "linear-gradient(85deg, rgba(249,249,249,1) 0%, rgba(236,236,236,1) 100%)" }}
              contentArrowStyle={{ opacity: 0.5, borderRight: "7px solid", borderRightColor: x.iconStyle.background, marginTop: "-5px" }}
              className="vertical-timeline-element--work"
              date={x.date}
              iconStyle={x.iconStyle}
              icon={icons[x.iconCode]}
              position={x.position}
            >
              {x.title && <h4 className="vertical-timeline-element-title">{x.title}</h4>}
              {x.subtitle && <h5 className="vertical-timeline-element-subtitle">{x.subtitle}</h5>}
              {x.description && <p>   {x.description}               </p>}

              {/*FUTURE <FaChalkboardTeacher style={{
                float: "right",
                marginTop: "11px",
                marginLeft: "5px",
                fontSize: "1.3rem"


              }} />
              <FaUserGraduate style={{
                float: "right",
                marginTop: "11px",
                marginLeft: "5px",
                fontSize: "1.3rem"
              }} /> */}


            </VerticalTimelineElement>
          })}




        </VerticalTimeline>

      </Card>
    </Container>



  </div >)
}



export default TimeLine;
