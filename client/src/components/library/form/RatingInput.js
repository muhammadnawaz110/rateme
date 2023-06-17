import { Box, FormHelperText, Rating} from "@mui/material";

function RatingInPut(props){
    const { input, meta:{ error}, ...rest } = props;
    return (
        <Box width="100%" textAlign='center'>
            <Rating precision={0.5} value={parseFloat(input.value)} onChange={(event, newValue) => input.onChange(newValue)}/>
            <FormHelperText error sx={{ textAlign: 'center', mb:2}}>
                {
                  error ? error : <span>&nbsp;</span>
                 }
            </FormHelperText>
        </Box>
    )
}

export default RatingInPut;