import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { showProgressBar, hideProgressBar } from "./store/actions/progressBarActons";
import ProgressBar from "./components/library/ProgressBar";
import AppPublic from "./AppPublic";
import { loadAuth, loadToken } from "./store/actions/authActions";
import {useEffect} from "react"


function App() {
  const dispatch = useDispatch();
  useEffect(() =>{
    dispatch( loadToken() );
    dispatch( loadAuth() );

  }, []);
  return <AppPublic/>
  return (
    <div className="App">
      <Button onClick={() => dispatch(showProgressBar())}>show progressBar</Button>
      <Button onClick={() => dispatch(hideProgressBar())}>hide progressBar</Button>

   <ProgressBar/>
    </div>
  );
}

export default App;
