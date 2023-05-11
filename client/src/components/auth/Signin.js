import { Box, Button, CircularProgress } from "@mui/material";
import { Field, Form } from "react-final-form";
import TextInput from "../library/form/TextInput";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showError } from "../../store/actions/alertActions";
import { signin } from "../../store/actions/authActions";

function Signin() {
    const dispatch = useDispatch();
    return (
        <Box p={3} bgcolor={"#fff"} textAlign="center" borderRadius="5px" minWidth="350px" boxShadow="0px 0px 17px 5px #dbdada">
            <h3>Rate Me</h3>
            <Form
                onSubmit={(data) => {
                    return axios.post('/users/signin', data).then(({data}) => {
                        dispatch( signin(data.user, data.token) )
                        localStorage.setItem('token', data.token)
                    }).catch(err => {
                        let message = err && err.response && err.response.data ? err.response.data.error : err.message;
                        dispatch(showError(message));
                    })
                }}
                validate={(data) => {
                    const errors = {};
                    if (!data.email)
                        errors.enail = "Email address is required";
                    else if (!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(data.email))
                        errors.email = "Invalid email address";


                    if (!data.password)
                        errors.password = "Password is required";

                    return errors;
                }}
            >
                {
                    (props) => {
                        const { invalid, submitting } = props;
                        return (
                            <form onSubmit={props.handleSubmit}>
                                <Field name="email" type="email" component={TextInput} placeholder="Enter email addres..." autoFocus />
                                <Field name="password" type="password" component={TextInput} placeholder="Enter Password..." />
                                <Button variant="outlined" type="submit" disabled={invalid || submitting}>Sign in {
                                    submitting && <CircularProgress style={{ marginLeft: '10px' }} size={20} />
                                } </Button>
                                <Box mt={2}>
                                    <Link style={{ textDecoration: "none" }} to="/admin/forgot-password">Forgot Password</Link>
                                </Box>
                            </form>
                        )
                    }
                }
            </Form>
        </Box>
    )
}

export default Signin;