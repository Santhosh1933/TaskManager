import React, { useContext, useEffect, useState } from "react";
import { API, Api } from "../constant";
import Avatar from "@mui/material/Avatar";
import { Button, ButtonGroup, Typography } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import AddTaskIcon from "@mui/icons-material/AddTask";
import GlobalContext from "../GlobalContext";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
export default function Tasks() {
  const api = API;
  const context = useContext(GlobalContext);
  const [userDetails, setUserDetails] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [currentTab, setCurrentTab] = useState("TodaysTask");
  const [assignedBy, setAssignedBy] = useState([]);
  const [assignerId, setAssignerId] = useState();

  async function getUserDetails(userId) {
    if (userId) {
      const response = await fetch(`${api}/users?userId=${userId}`);
      const data = await response.json();
      setAssignedBy(data[0]);
    } else {
      const response = await fetch(`${api}/users?userId=${context.userId}`);
      const data = await response.json();
      setUserDetails(data[0]);
    }
  }

  useEffect(() => {
    getUserDetails(assignerId);
  }, [assignerId]);

  async function getTasks() {
    const response = await fetch(`${api}/Tasks?userId=${context.userId}`);
    const data = await response.json();
    setTasks(data);
  }
  async function getAssignedTask() {
    const response = await fetch(`${api}/assignees?userId=${context.userId}`);
    const data = await response.json();
    setAssignedTasks(data);
  }

  function formateDate(deadline) {
    const date = new Date(deadline);

    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  }

  useEffect(() => {
    getUserDetails();
    getTasks();
    getAssignedTask();
  }, [context]);

  const TodaysTask = () => {
    function findTodaysTask(dateOfCreation) {
      const today = new Date();
      const taskDate = new Date(dateOfCreation);

      // Set the time part of both dates to 00:00:00.000 to compare only the dates.
      today.setHours(0, 0, 0, 0);
      taskDate.setHours(0, 0, 0, 0);
      return today.getTime() === taskDate.getTime();
    }

    return (
      <div>
        {tasks.map((data, i) => {
          if (findTodaysTask(data.dateOfCreation)) {
            return (
              <Accordion key={i}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <p className="font-semibold uppercase tracking-wide text-amber-800">
                    {data.title}
                  </p>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="flex flex-col gap-4">
                    <p className="text-red-600">
                      DeadLine : {formateDate(data.deadLine)}
                    </p>
                    <p className=" text-slate-600">{data.priority}</p>
                    <p>{data.description}</p>
                    {data.subTasks.map((sub, i) => (
                      <p>👉{sub}</p>
                    ))}
                  </div>
                  <div className="flex justify-center pt-4 pb-2">
                    <ButtonGroup variant="text" aria-label="text button group">
                      <Button color="warning">on progress</Button>
                      <Button color="success">Complete</Button>
                      <Button color="error">Delete</Button>
                    </ButtonGroup>
                  </div>
                </AccordionDetails>
              </Accordion>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const AssignedTask = () => {
    return (
      <div>
        {assignedTasks.map((data, i) => (
          <Accordion key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <p className="font-semibold uppercase tracking-wide text-amber-800">
                {data.title}
              </p>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-col gap-4">
                {setAssignerId(data.userId)}
                <div>
                  <p className="font-semibold ">Assigned By</p>
                  <p className="text-sm">{assignedBy.name}</p>
                  <p className="text-sm">{assignedBy.email}</p>
                </div>
                <p className="text-red-600">
                  DeadLine : {formateDate(data.deadLine)}
                </p>
                <p className=" text-slate-600">{data.priority}</p>
                <p>{data.description}</p>
                {data.subTasks.map((sub, i) => (
                  <p>👉{sub}</p>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  };

  const AllTask = () => {
    return (
      <div>
        {tasks.map((data, i) => (
          <Accordion key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <p className="font-semibold uppercase tracking-wide text-amber-800">
                {data.title}
              </p>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-col gap-4">
                <p className="text-green-600">
                  Created At : {formateDate(data.dateOfCreation)}
                </p>

                <p className="text-red-600">
                  DeadLine : {formateDate(data.deadLine)}
                </p>
                <p className=" text-slate-600">{data.priority}</p>
                <p>{data.description}</p>
                {data.subTasks.map((sub, i) => (
                  <p>👉{sub}</p>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  };

  return (
    <div className=" min-h-screen ">
      <nav className="bg-white min-h-[20vh] md:min-h-[10vh] w-full flex justify-center gap-2 flex-col md:flex-row md:justify-around  items-center">
        <p className="uppercase font-semibold text-amber-600 text-lg tracking-widest">
          Task Manger <span className="text-slate-700">App</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button startIcon={<TodayIcon />}>Tasks</Button>
          <Button startIcon={<AddTaskIcon />}>Add Task</Button>
        </div>
        <p className="text-slate-700">{userDetails?.email}</p>
      </nav>
      <section className="sm:w-3/4 mx-auto bg-[#ffffff57] min-h-[70vh] mt-[10vh] backdrop-blur-2xl border border-[0.5px]-white sm:rounded-md">
        <div className="bg-slate-50 text-center p-4 overflow-x-scroll remove-scroll border-b">
          <ButtonGroup variant="text" aria-label="text button group">
            <Button onClick={() => setCurrentTab("TodaysTask")}>
              Today's Tasks
            </Button>
            <Button onClick={() => setCurrentTab("AssignTask")}>
              Assigned Tasks
            </Button>
            <Button onClick={() => setCurrentTab("AllTask")}>All Tasks</Button>
            <Button>On progress</Button>
            <Button>Completed Tasks</Button>
            <Button>Deleted Tasks</Button>
          </ButtonGroup>
        </div>
        <div className="w-full sm:p-8">
          <div className="w-full p-4 bg-slate-50">
            {currentTab === "TodaysTask" ? (
              <TodaysTask />
            ) : currentTab === "AssignTask" ? (
              <AssignedTask />
            ) : currentTab === "AllTask" ? (
              <AllTask />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
