import { Avatar, Box, Button, Grid, Rating, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { showError, showSuccess } from "../../store/actions/alertActions"
import ProgressBar from "../library/ProgressBar"
import { Field, Form } from "react-final-form"
import TextInput from "../library/form/TextInput"
import { hideProgressBar, showProgressBar } from "../../store/actions/progressBarActons"
import RatingInPut from "../library/form/RatingInput"
import Alert from "../library/Alert"

 function Feedback() {
    const {employeeId} = useParams()
    const[employee, setEmployee] = useState(null)
    const dispatch = useDispatch()
    const navigator = useNavigate()

    useEffect(() =>{
        dispatch(showProgressBar())
        axios.get('/api/employees/publicDetails/' + employeeId).then((result) => {
            dispatch(hideProgressBar())
            setEmployee(result.data.employee)
        }).catch(error =>{
        let message = error && error.response && error.response.data ? error.response.data.error : error.message;
          dispatch(hideProgressBar())
          dispatch(showError(message))
        })
      },[])

      const validate = (data) => {
        const errors = {};
        if(!data.rating) errors.rating = "Rating is required"
        if (!data.name) errors.name = "Name is required";
         return errors
      };

      const handleSumbmit = async (data, form) => {
        try {
          dispatch(showProgressBar())
          let result = await axios.post("api/employees/feedback", {employeeId, ...data});
          if (result.data.success) {
            dispatch(showSuccess('Feedback send successfully'))
            navigator(`/`)
          }
          dispatch(hideProgressBar())
    
        } catch (error) {
          let message = error && error.response && error.response.data ? error.response.data.error : error.message;
          dispatch(hideProgressBar())
          dispatch(showError(message))
        }
      };

  return (

    <Box my={3}>
        <ProgressBar />
        <Alert />
        {
            employee &&
            <Grid container spacing={4}>
                <Grid item xs={12} md={6} mx="auto">
                    <Avatar variant="square" sx={{width:"100%", height:"auto"}} src={process.env.REACT_APP_BASE_URL + 'content/'+ employee.deartmentId +'/' + employee.profilePicture} />
                    <Typography sx={{mt: 3,}} textAlign="center"  variant="h5">{employee.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6} mx="auto">

                <Typography textAlign='center' variant="h6" gutterBottom>Give Feedback to {employee.name}</Typography>
                <Form
                    onSubmit={handleSumbmit}
                    validate={validate}
                    initialValues={{}}
                    render={({
                    handleSubmit,
                    submitting,
                    invalid,
                    }) => (
                    <form onSubmit={handleSubmit} method="post">
                        <Field component={RatingInPut} name= "rating"/>
                        <Field component={TextInput} multiline rows={5} type='text' name="message" placeholder="Enter your message or feedback..." />
                        <Field component={TextInput} type='text' name="name" placeholder="Enter your name..." />
                        <Field component={TextInput} type='text' name="phone" placeholder="Enter phone number..." />
                        <Box textAlign="center">
                            
                        <Button
                        sx={{ marginTop: '20px' }}
                        variant="outlined"
                        type="submit"
                        disabled={invalid || submitting}
                        >submit </Button>
                        </Box>
                    </form>
                    )}
                />
                </Grid>

            </Grid>
        }
            
        </Box>
  )
}
export default Feedback