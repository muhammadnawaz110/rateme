import { Box } from '@mui/material'
import { useSelector } from 'react-redux'

export default function BlockInterface() {
  const loading = useSelector(state => state.progressBar.loading);
  if (!loading) return null;
  return (
    <Box width='100%' bgcolor='#ffffff8a' height='100%' position='absolute' top='0px' left='0px' zIndex={1}>

    </Box>
  )
}
