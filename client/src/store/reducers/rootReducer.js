import { combineReducers } from "redux"
import alertReducer from "./alertReducer";
import progressBarReducer from "./progressBarReducer";
import authReducer from "./authReducer";
import departmentReducer from "./departmentReducer";

const allReducers = {
    auth: authReducer,
    alert : alertReducer,
    progressBar: progressBarReducer,
    departments: departmentReducer,
}

const rootReducer = combineReducers(allReducers);
export default rootReducer