import { Button } from "@mui/material";
import { connect, useDispatch } from "react-redux";
import { showProgressBar, hideProgressBar } from "./store/actions/progressBarActons";
import ProgressBar from "./components/library/ProgressBar";
import AppPublic from "./AppPublic";
import { loadAuth, signout } from "./store/actions/authActions";
import {useEffect} from "react"
import AppPreLoader from "./components/library/AppPreloader";


function App({ user, isAuthLoaded, loadAuth, signout}) {
  useEffect(() =>{
     loadAuth()

  }, []);

  if(!isAuthLoaded) return <AppPreLoader message={"Loading App"}/>

  if( !user)
    return <AppPublic />
  return (
    <div className="App">
      your are signed in
      <Button onClick={signout}>Logout</Button>

   <ProgressBar/>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isAuthLoaded: state.auth.isLoaded
  }
}

export default connect(mapStateToProps, {loadAuth, signout})(App);
