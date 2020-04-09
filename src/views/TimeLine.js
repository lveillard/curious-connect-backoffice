import React from "react";

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import "../assets/css/timeline.css"

import TimeLineData from "./TimeLineData"

import { FaChalkboardTeacher, FaBeer, FaPlay, FaVideo, FaWpforms, FaTasks, FaUserGraduate } from 'react-icons/fa';
import { AiOutlineSchedule } from 'react-icons/ai';
import { MdWork } from 'react-icons/md'

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "variables/charts.js";

import Header from "components/Headers/Header.js";


const TimeLine = () => {

  const icons = {
    Work: <MdWork />, Teacher: <FaChalkboardTeacher />, Task: <FaTasks />, Form: <FaWpforms />, Video: <FaVideo />, Schedule: <AiOutlineSchedule />, Play: <FaPlay />
  }
  return (<div>
    <Header />

    <Container className="mt--7" fluid >

      <Card>

        <VerticalTimeline>
          {TimeLineData.map((x) => {
            return < VerticalTimelineElement
              contentStyle={{ borderTop: "4px solid", borderColor: x.iconStyle.background, background: "linear-gradient(85deg, rgba(249,249,249,1) 0%, rgba(236,236,236,1) 100%)" }}
              contentArrowStyle={{ opacity: 0.5, borderRight: "7px solid", borderRightColor: x.iconStyle.background }}
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
