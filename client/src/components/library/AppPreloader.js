import { Box, CircularProgress } from "@mui/material";

function AppPreLoader({ message }){
    return(
        <Box display={'flex'} flexDirection={'column'}  textAlign={'center'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
            <div>
                <CircularProgress />
                <h4>{message}</h4>
            </div>
        </Box>
    )
}

export default AppPreLoader;