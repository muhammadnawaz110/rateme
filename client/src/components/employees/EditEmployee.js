import { Form, Field } from "react-final-form";
import { Button, Box } from "@mui/material";
import axios from "axios";
import { connect, useDispatch } from "react-redux";
import TextInput from "../library/form/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { hideProgressBar, showProgressBar } from "../../store/actions/progressBarActons";
import FileInput from "../library/form/FileInput";
import { showError, showSuccess } from "../../store/actions/alertActions";
import { addDepartment } from "../../store/actions/departmentActions";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";


function EditEmployee() {
  const dispatch = useDispatch()
  const navigator = useNavigate()
  const { employeeId} = useParams()
  const [employee, setEmployee] = useState(null)

useEffect(() => {
    dispatch(showProgressBar())
    axios.get('api/employees/details/'+ employeeId).then(result => {
      dispatch(hideProgressBar())
      console.log(result)
      setEmployee(result.data.employee)

    }).catch(error => {
      dispatch(hideProgressBar())
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatch(showError(message))
    })
}, [])

  const validate = (data) => {
    const errors = {};

    if (!data.name) errors.name = "Name is required";
    if (!data.phone) errors.phone = "Phone is required";
    if (!data.cnic) errors.cnic = "CNIC is required";
    if (!data.designation) errors.designation = "Designation is required";
     if (data.email &&   !/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(data.email))
      errors.email = "Invalid email address";

    return errors
  };


  const handleSubmit = async (data, form) => {
    try {
      dispatch(showProgressBar())
      let result = await axios.postForm("api/employees/edit", {id: employeeId, deptId: employee.departmentId, ...data});
      if (result.data.success) {
        dispatch(showSuccess('Employee Edited successfully'))
        navigator(`/admin/employees/${employee.departmentId}`)
      }
      dispatch(hideProgressBar())

    } catch (error) {
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatch(hideProgressBar())
      dispatch(showError(message))
    }
  };

  if(!employee) return null

  return (
    <Box textAlign={'center'} sx={{ width: { sm: "50%", md: "50%" }, mx: "auto" }}>
      <h3>Edit Employees</h3>
      <Form
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={ employee }
        
        render={({
          handleSubmit,
          submitting,
          invalid,
        }) => (
          <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <Field component={TextInput} type='text' name="name" placeholder="Enter name" />
            <Field component={TextInput} type='email' name="email" placeholder="Enter email address" />
            <Field component={TextInput} type='text' name="phone" placeholder="Enter phone number" />
            <Field component={TextInput} type='text' name="cnic" placeholder="Enter CNIC" />
            <Field component={TextInput} type='text' name="designation" placeholder="Enter designation" />
            <Field component={FileInput} type='file' name="profilePicture" inputProps={{ accept: "image/*" }} />

            <Button
              sx={{ marginTop: '20px' }}
              variant="outlined"
              type="submit"
              disabled={invalid || submitting}
            >Edit Department</Button>
          </form>
        )}
      />
    </Box>
  );
}



export default EditEmployee;