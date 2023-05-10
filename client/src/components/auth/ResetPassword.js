
import { Box, Button } from "@mui/material";
import { Field, Form } from "react-final-form";
import TextInput from "../library/form/TextInput";
import {Link} from "react-router-dom";

function ResetPassword() {
    return (
        <Box p={3} bgcolor={"#fff"} textAlign="center" borderRadius="5px" minWidth="350px" boxShadow="0px 0px 17px 5px #dbdada">
            <h3>Rate Me</h3>
            <Form
                onSubmit={(data) => {
                    console.log("submitting", data);
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
                        return (
                            <form onSubmit={props.handleSubmit}>
                                <Field name="newPassword" type="password" component={TextInput} placeholder="Enter Password..." />
                                <Field name="confirmPassword" type="password" component={TextInput} placeholder="Confirm Password..." />
                                <Button variant="outlined" type="submit">Chacnge Password</Button>
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