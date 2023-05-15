
import { Box, Button, CircularProgress } from "@mui/material";
import { Field, Form } from "react-final-form";
import TextInput from "../library/form/TextInput";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { showError, showSuccess } from "../../store/actions/alertActions";

function ResetPassword() {
    const { resetCode } = useParams();
    const dispatch = useDispatch();
    const navigator = useNavigate();
    useEffect(() => {
        axios.post('/users/verify-reset-code', { code: resetCode}).then(result =>{

        }).catch(err =>{
            dispatch( showError('invalid request'));
            navigator('/admin/signin')
        })
    }, []);
    return (
        <Box p={3} bgcolor={"#fff"} textAlign="center" borderRadius="5px" minWidth="350px" boxShadow="0px 0px 17px 5px #dbdada">
            <h3>Rate Me</h3>
            <Form
                onSubmit={(data) => {
                    return axios.post('/users/reset-password', {...data, code: resetCode}).then(({data}) => {
                        if(data.success)
                        {
                            dispatch( showSuccess("Password change successfuly, please login whith new password"))
                            navigator('/admin/signin')
                        }
                        // dispatch( signin(data.user, data.token) )
                        localStorage.setItem('token', data.token)
                    }).catch(err => {
                        let message = err && err.response && err.response.data ? err.response.data.error : err.message;
                        dispatch(showError(message));
                    })
                }}
                validate={(data) => {
                    const errors = {};
                    if(!data.newPassword)
                        errors.newPassword = " password is required";
                    else if(data.newPassword.length < 6)
                        errors.newPassword = "Password should have at least 6 characters";

                    if (!data.confirmpassword)
                        errors.confirmpassword = "Please confirm password";
                    
                    else  if(data.newPassword !== data.confirmpassword)
                        errors.confirmpassword = "password are not same"

                    return errors;
                }}
            >
                {
                    (props) => {
                        const { submitting, invalid } = props;
                        return (
                            <form onSubmit={props.handleSubmit}>
                                <Field name="newPassword" type="password" component={TextInput} placeholder="Enter Password..." />
                                <Field name="confirmPassword" type="password" component={TextInput} placeholder="Confirm Password..." />
                                <Button
                            sx={{ marginTop: '20px' }}
                            variant="outlined"
                            type="submit"
                            disabled={invalid || submitting}
                        >
                            Change Password {submitting && <CircularProgress style={{ marginLeft: '10px' }} size={20} />}
                        </Button>
                                <Box mt={2}>
                                    <Link style={{textDecoration:"none"}} to="/admin/Signin">Sign in</Link>
                                </Box>

                            </form>
                        )
                    }
                }
            </Form>
        </Box>
    )
}

export default ResetPassword;