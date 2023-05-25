import { Form, Field } from "react-final-form";
import { Button, Box } from "@mui/material";
import axios from "axios";
import { connect, useDispatch, useSelector } from "react-redux";
import TextInput from "../library/form/TextInput";
import { hideProgressBar, showProgressBar } from "../../store/actions/progressBarActons";
import FileInput from "../library/form/FileInput";
import { showError, showSuccess } from "../../store/actions/alertActions";
import {  updateDepartment } from "../../store/actions/departmentActions";
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";



function EditDepartment() {
  const dispatch = useDispatch()
  const navigator = useNavigate()

const { deptId } = useParams()
const department = useSelector( state  => state.departments.records.find(item => item._id === deptId));
if(!department)
{
  return <Navigate to='/admin/departments'/>
}



  const validate = (data) => {
    const errors = {};

    if (!data.name) errors.name = "Name is required";
    if (!data.email) errors.email = "Email is required";
    else if (!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(data.email))
      errors.email = "Invalid email address";

    return errors
  };


  const handelDepartment = async (data, form) => {
    try {
      dispatch(showProgressBar())
      let result = await axios.postForm("api/departments/edit", { ...data,  id: deptId});
      if (result.data.department) {
        dispatch(updateDepartment(result.data.department));
        dispatch(showSuccess('Department added successfully'))
        navigator('/admin/departments');
      }
      dispatch(hideProgressBar())

    } catch (error) {
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatch(hideProgressBar())
      dispatch(showError(message))
    }
  };


  return (
    <Box textAlign={'center'} sx={{ width: { sm: "50%", md: "50%" }, mx: "auto" }}>
      <h3>Update Department</h3>
      <Form
        onSubmit={handelDepartment}
        validate={validate}
        initialValues={{
          name: department && department.name,
          email: department && department.email,
          phone: department && department.phone,
          address: department && department.address,
        }}
        render={({
          handleSubmit,
          submitting,
          invalid,
        }) => (
          <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <Field component={TextInput} type='text' name="name" placeholder="Enter name" />
            <Field component={TextInput} type='email' name="email" placeholder="Enter email address" />
            <Field component={TextInput} type='text' name="phone" placeholder="Enter phone number" />
            <Field component={FileInput} type='file' name="logo" inputProps={{ accept: "image/*" }} />
            <Field component={TextInput} type='text' multiline rows={5} name="address" placeholder="Enter address" />

            <Button
              sx={{ marginTop: '20px' }}
              variant="outlined"
              type="submit"
              disabled={invalid || submitting}
            >Update Department</Button>
          </form>
        )}
      />
    </Box>
  );
}



export default EditDepartment;