import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import projectReducer from "./projectSlice";
import taskReducer from "./taskSlice";
import messageReducer from "./messageSlice";
import taskMessageReducer from './taskMessageSlice';
import devicesReducer from "./devicesSlice";
import assignReducer from "./assignSlice";
import requestReducer from './requestSlice';
import ipaddressReducer from './ipaddressSlice';
import attendanceReducer from "./attendanceSlice";
import attendanceRequestReducer from "./attendanceRequestSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    message: messageReducer,
    task: taskReducer,
    taskMessage: taskMessageReducer,
    devices:devicesReducer,
    assign :assignReducer,
    request:requestReducer,
    ip:ipaddressReducer,
    attendance: attendanceReducer,
    attendanceRequest: attendanceRequestReducer,
    },
});
