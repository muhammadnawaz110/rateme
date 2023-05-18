import { Box, Button, CircularProgress } from "@mui/material";
import { Field, Form } from "react-final-form";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect, useDispatch } from "react-redux";
import { showError, showSuccess } from "../store/actions/alertActions";
import TextInput from "./library/form/TextInput";
import { hideProgressBar, showProgressBar } from "../store/actions/progressBarActons";

function AccountSettings({ user }) {

    const dispatch = useDispatch();
    return (
        <Box p={3} bgcolor={"#fff"} textAlign="center" borderRadius="5px" minWidth="350px" boxShadow="0px 0px 17px 5px #dbdada">
            <h3>Account Settings</h3>
            <Form
                onSubmit={(data) => {
                    dispatch(showProgressBar())
                    return axios.post('/users/profile-update', data).
                        then(({ data }) => {
                            if (data.user) {
                                dispatch(showSuccess('Account Setting update successfully'));
                            }
                            dispatch(hideProgressBar());
                        }).catch(err => {
                            let message = err && err.response && err.response.data ? err.response.data.error : err.message;
                            dispatch(showError(message));
                            dispatch(hideProgressBar())
                        })
                }}
                validate={(data) => {
                    const errors = {};
                    if (!data.name) errors.name = "Please enter name";
                    if (!data.phoneNumber) errors.phoneNumber = "Please enter phone number";

                    if (data.newPassword) {
                        if (!data.currentPassword) errors.currentPassword = "Please enter current password";

                        if (data.newPassword.length < 6)
                            errors.newPassword = "Password should have at least 6 characters";
                        if (!data.confirmPassword)
                            errors.confirmPassword = "Please confirm password";

                        if (data.confirmPassword && data.newPassword !== data.confirmPassword)
                            errors.confirmPassword = "Passwords are not same";

                    }
                    return errors;
                }}
                initialValues={{
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                }}
            >
                {
                    (props) => {
                        const { invalid, submitting } = props;
                        return (
                            <form onSubmit={props.handleSubmit}>
                                <Field name="name" type="text" component={TextInput} placeholder="Enter email addres..." disable />
                                <Field name="email" type="email" component={TextInput} placeholder="Enter email addres..." disable />
                                <Field name="phoneNumber" type="phonenumber" component={TextInput} placeholder="Enter phone number..." />
                                <Field name="currentPassword" type="password" component={TextInput} placeholder="Current Password..." />
                                <Field name="newPassword" type="password" component={TextInput} placeholder=" New Password..." />
                                <Field name="confirmPassword" type="password" component={TextInput} placeholder="Confirm Password..." />
                                <Button variant="outlined"
                                    type="submit" disabled={invalid || submitting}> Update {
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

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    }
};

export default connect(mapStateToProps)(AccountSettings);