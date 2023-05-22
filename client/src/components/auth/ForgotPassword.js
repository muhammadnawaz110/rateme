import { Form, Field } from "react-final-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import TextInput from "../library/form/TextInput";
import { Button, Box, CircularProgress } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showError, showSuccess } from "../../store/actions/alertActions";

function ForgotPassword() {
    const dispatch = useDispatch();
    const navigator = useNavigate();


    const validate = (data) => {
        const errors = {};

        if (!data.email) errors.email = "Email address is required";
        else if (!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(data.email))
            errors.email = "Invalid email address";
        return errors
    };


    const handelForgotPassword = async (data, form) => {
        try {
            let result = await axios.post("api/users/forgot-password", data);
            if(result.data)
            {
                navigator("/admin/signin");
                dispatch( showSuccess('An email has been sent successfuly to your inbox, plse check to reset'))
            }            // dispatch(signin(user, token));

        } catch (error) {
            let message = error && error.response && error.response.data ? error.response.data.error : error.message;
            dispatch(showError(message))
        }

    };


    return (
        <Box bgcolor={'#fff'} p={3} textAlign={'center'} minWidth={'350px'} borderRadius="5px" boxShadow="0 0 17px 5px #dbdada">
            <h3>Rate Me</h3>
            <Form
                onSubmit={handelForgotPassword}
                validate={validate}
                initialValues={{}}
                render={({
                    handleSubmit,
                    submitting,
                    invalid
                }) => (
                    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                        <Field component={TextInput} type='text' name="email" placeholder="Enter your email" />
                        <Button
                            sx={{ marginTop: '20px' }}
                            variant="outlined"
                            startIcon={<FontAwesomeIcon icon={faKey} />}
                            type="submit"
                            disabled={invalid || submitting}
                        >
                            Reset Password {submitting && <CircularProgress style={{ marginLeft: '10px' }} size={20} />}
                        </Button>
                        <Box mt={2}>
                            <Link style={{ textDecoration: 'none' }} to="/admin/signin">Sign in?</Link>
                        </Box>
                    </form>
                )}
            />
        </Box>
    );
}

export default ForgotPassword;