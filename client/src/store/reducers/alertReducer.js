import { alertActionTypes } from "../actions/alertActions";

const initState  = {
    success : null,
    error : null,
    info : null,
    warning : null,
}
const alertReducer = (state = initState, action ) =>{
    switch (action.type) {
        case alertActionTypes.SHOW_SUCCES:
            return{
                ...state,
                success: action.message,
            }
            case alertActionTypes.SHOW_ERROR:
            return{
                ...state,
                error : action.message,
            }
            case alertActionTypes.SHOW_INFO:
            return{
                ...state,
                info : action.message,
            }
            case alertActionTypes.SHOW_WARNING:
            return{
                ...state,
                warning: action.message,
            }
            case alertActionTypes.CLEAR_ALERT:
            return initState
        default:
            return state;
    }
}

export default alertReducer;