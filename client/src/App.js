import { Button, Container } from "@mui/material";
import { connect } from "react-redux";
import ProgressBar from "./components/library/ProgressBar";
import AppPublic from "./AppPublic";
import { loadAuth, signout } from "./store/actions/authActions";
import {useEffect} from "react"
import AppPreLoader from "./components/library/AppPreloader";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import AppBar from "./components/AppBar";
import AccountSettings from "./components/AccountSettings";
import Dashboard from "./components/DashBoard";
import Alert from "./components/library/Alert";

const publicRoutes = [ "/admin/signin", "/admin/forgot-password", "/admin/reset-password/"]

function App({ user, isAuthLoaded, loadAuth, signout}) {
  const location = useLocation();
  useEffect(() =>{
     loadAuth()
  }, []);

  if(!isAuthLoaded) return <AppPreLoader message={"Loading App"}/>


  if(user && publicRoutes.find(url => location.pathname.startsWith(url)))
    return <Navigate to ="/admin/dashboard" />
  if(!user && !publicRoutes.find( url =>location.pathname.startsWith(url)))
    return <Navigate to="/admin/signin" />
  if(location.pathname === '/' || location.pathname === '/admin')
    return< Navigate to="/admin/signin" />


  if( !user)
    return <AppPublic />
  return (
    <div className="App">
      <AppBar/>
      <Alert />

   <ProgressBar/>
   <Container sx={{ mt: 10 }} maxWidth="lg">
        <Routes>
          <Route path="/admin/account-settings" Component={AccountSettings} />
          <Route path="/admin/dashboard" Component={Dashboard} />
        </Routes>
      </Container>
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