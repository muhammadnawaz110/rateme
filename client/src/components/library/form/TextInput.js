import { Box, FormHelperText, TextField } from "@mui/material";

function TextInput(props){
    const { input, meta:{ error, touched}, ...rest } = props;
    return (
        <Box width="100%">
            <TextField {...input} {...rest} fullWidth size="small" error={touched && error ? true : false}/>
            <FormHelperText error={true}>
                { touched && error ? error : <span>&nbsp;</span>}
            </FormHelperText>
        </Box>
    )
}

export default TextInput;