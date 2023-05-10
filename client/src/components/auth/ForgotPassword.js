import { Box, Button } from "@mui/material";
import { Field, Form } from "react-final-form";
import TextInput from "../library/form/TextInput";
import {Link} from "react-router-dom";


function ForgotPassword() {
    return (
        <Box p={3} bgcolor={"#fff"} textAlign="center" borderRadius="5px" minWidth="350px" boxShadow="0px 0px 17px 5px #dbdada">
            <h3>Rate ME</h3>
            <Form
                onSubmit={(data) => {
                    console.log("submitting", data);
                }}
                validate={(data) => {
                    const errors = {};
                    if (!data.email)
                        errors.enail = "Email address is required";
                    else if (!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(data.email))
                        errors.email = "Invalid email address";

                    return errors;
                }}
            >
                {
                    (props) => {
                        return (
                            <form onSubmit={props.handleSubmit}>
                                <Field name="email" type="email" component={TextInput} placeholder="Enter Email" />
                                <Button type="submit" variant="outlined">React Password</Button>
                                <Box mt={2}>
                                    <Link style={{textDecoration:"none"}} to="/admin/signin">Forgot Password</Link>
                                </Box>
                            </form>
                        )
                    }
                }
            </Form>
        </Box>
    )
}

export default ForgotPassword;