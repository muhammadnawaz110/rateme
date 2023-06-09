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
import BlockInterface from "./components/library/BlockInterface.js";
import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment";
import Department from "./components/departments/Departments";
import Departments from "./components/departments/Departments";
import AddUser from "./components/user/AddUser";
import User from "./components/user/User";
import EditUser from "./components/user/EditUser";
import { userTypes } from "./utils/constants";
import Employees from "./components/employees/Employees";
import AddEmployee from "./components/employees/AddEmployee";
import EditEmployee from "./components/employees/EditEmployee";
import EmployeeProfile from "./components/employees/EmployeeProfile";
import NotFound404 from "./components/library/NotFound404";


const publicRoutes = [ "/admin/signin", "/admin/forgot-password", "/admin/reset-password/"]
const feedbackRouts = [ '/' , '/employee/feedback']
function App({ user, isAuthLoaded, loadAuth, userType}) {
  const location = useLocation();
  useEffect(() =>{
     loadAuth()
  }, []);

  if(!isAuthLoaded) return <AppPreLoader message={"Loading Ap...."}/>

  if(user)
  {
    if(user && publicRoutes.find(url => location.pathname.startsWith(url)))
      return <Navigate to ="/admin/dashboard" />
    if(location.pathname === '/' || location.pathname.startsWith('/employee/feedback'))
      return <Navigate to='/admin/dashboard' />
  }else
  {
    if(!publicRoutes.find(url => location.pathname.startsWith(url)) && location.pathname !== '/' && !location.pathname.startsWith('/employee/feedback'))
      return <Navigate to='/' />
  }


  if( !user)
    return <AppPublic />
  return (
    <div className="App">
      <AppBar/>
      <Alert />

   <ProgressBar/>
   <Container sx={{ mt: 10, position: 'relative', p:3, backgroundColor: '#fff', borderRadius:'5px',  boxShadow:"0px 0px 17px 5px #dbdada" }} maxWidth="lg">
       <BlockInterface />
        <Routes>
          <Route path="/admin/account-settings" Component={AccountSettings} />
          <Route path="/admin/dashboard" Component={Dashboard} />
          {
            userType === userTypes.USER_TYPE_SUPER &&
              <>
                <Route path="/admin/departments" Component={Departments} />
                <Route path="/admin/departments/add" Component={AddDepartment} />
              </>
          }
          <Route path="/admin/departments/edit/:deptId" Component={EditDepartment} />
          <Route path="/admin/users" Component={User} />
          <Route path="/admin/users/add" Component={AddUser} />
          <Route path="/admin/users/edit/:userId" Component={EditUser} />
          <Route path="/admin/employees/:deptId" Component={Employees} />
          <Route path="/admin/employees/add/:deptId" Component={AddEmployee} />
          <Route path="/admin/employees/edit/:employeeId" Component={EditEmployee} />
          <Route path="/admin/employees/profile/:employeeId" Component={ EmployeeProfile} />
          <Route path="*" Component={ NotFound404} />

          
        </Routes>
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isAuthLoaded: state.auth.isLoaded,
    userType : state.auth.userType,
  }
}

export default connect(mapStateToProps, {loadAuth, signout})(App);