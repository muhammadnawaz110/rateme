import { Button } from "@mui/material";
import { connect } from "react-redux";
import ProgressBar from "./components/library/ProgressBar";
import AppPublic from "./AppPublic";
import { loadAuth, signout } from "./store/actions/authActions";
import {useEffect} from "react"
import AppPreLoader from "./components/library/AppPreloader";
import {Navigate, useLocation} from "react-router-dom";

const publicRoutes = [ "/admin/signin", "/admin/forgot-password", "/admin/reset-password/"]
function App({ user, isAuthLoaded, loadAuth, signout}) {
  const location = useLocation();
  useEffect(() =>{
     loadAuth()
  }, []);

  if(!isAuthLoaded) return <AppPreLoader message={"Loading App"}/>

  if(user && publicRoutes.find(url => location.pathname.startsWith(url)))
    return <Navigate to ="/admin/dasboard" />
  if(!user && !publicRoutes.find( url =>location.pathname.startsWith(url)))
    return <Navigate to="/admin/signin" />
  if(location.pathname === '/' || location.pathname === '/admin')
    return< Navigate to="/admin/signin" />

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