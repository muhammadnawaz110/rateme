import { combineReducers } from "redux"
import alertReducer from "./alertReducer";
import progressBarReducer from "./progressBarReducer";
import authReducer from "./authReducer";

const allReducers = {
    auth: authReducer,
    alert : alertReducer,
    progressBar: progressBarReducer
}

const rootReducer = combineReducers(allReducers);
export default rootReducer