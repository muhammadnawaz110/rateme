import { Avatar, Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadDepartments } from '../../store/actions/departmentActions'
import { connect, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import { hideProgressBar, showProgressBar } from '../../store/actions/progressBarActons';
import axios from 'axios';
import { showError } from '../../store/actions/alertActions';
import DeleteEmployee from './DeleteEmployee';

function Employees({ departments, loadDepartments }) {
  const { deptId} = useParams()
  const dispatch = useDispatch();
  const [ department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  
  const loadEmployees = () => {
    dispatch(showProgressBar())
    axios.post("/api/employees/search", { deptId }).then( result => {
      setDepartment(result.data.department)
      setEmployees(result.data.employees)
      dispatch(hideProgressBar())
    }).catch(error => {
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatch(hideProgressBar())
      dispatch(showError(message))
    })
  }
  useEffect(() => {
    loadEmployees()
  }, [])
  return (
    <Box>

      <Box display='flex' justifyContent='space-between'>
        <Typography variant='h5'>Employees</Typography>
        <Box>
          <Button component={Link} to={`/admin/departments/edit/${deptId}`} variant='outlined' sx={{mr: 1}} startIcon={<EditIcon />}> Edit Department</Button>
          <Button component={Link} to={`/admin/employees/add/${deptId}`} variant='outlined' startIcon={<AddIcon />}> Add Employees</Button>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>profilePicture</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>CNIC</TableCell>
            <TableCell>Actions</TableCell>

          </TableRow>
        </TableHead>

        <TableBody>
          {
            employees.length === 0 &&
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center'}}>
                  Employee Not Found
              </TableCell>
            </TableRow>
          }
          {
            employees && employees .map(employee => (
              <TableRow key={employee._id}>               
               <TableCell>
                  <Avatar src={process.env.REACT_APP_BASE_URL  + "content/" + department._id + "/" + employees.profilePicture} />
               </TableCell>
               <TableCell>
                  {employee.name}
               </TableCell>
               <TableCell>
                  {employee.phone}
               </TableCell>
               <TableCell>
                  {employee.cnic}
               </TableCell>
               <TableCell>
                  <IconButton component={Link} to={`/admin/amployees/edit/${employee._id}`} > <EditIcon /> </IconButton>
                  <DeleteEmployee employeeId={employee._id} name={employee.name}/>
               </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
     
    </Box>
  )
}



export default Employees;


