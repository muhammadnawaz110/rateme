import { Box, Pagination, Rating, Typography } from '@mui/material'
import React, {useState, useEffect} from 'react'
import { hideProgressBar, showProgressBar } from '../../store/actions/progressBarActons'
import axios from 'axios'
import { showError } from '../../store/actions/alertActions'
import { useDispatch } from 'react-redux'
import moment from 'moment/moment'

export default function EmployeeFeedback({employeeId}) {

    const [rating, setRating] = useState([])
    const dispatch = useDispatch()
    const [page, setPage] = useState()
    const [numOfPages, setNumOfPages] = useState([]) 

    const loadRating = () => {
        dispatch(showProgressBar())
        axios.post("/api/employees/rating", { employeeId, page }).then( result => {
          setRating(result.data.rating)
          setNumOfPages(result.data.numOfPages)
          dispatch(hideProgressBar())
        }).catch(error => {
          let message = error && error.response && error.response.data ? error.response.data.error : error.message;
          dispatch(hideProgressBar())
          dispatch(showError(message))
        })
      }
      useEffect(() => {
        loadRating()
      },[])
  return (
   <Box mt={4}>
        <Typography variant='h5' gutterBottom>React FeedBack</Typography>
        {
            rating.map(rating => (
                <Box bgcolor='#ececec' p={3} borderRadius={3} mb={2} key={rating._id}>
                    <Typography>{rating.name} <span style={{ color: '#7a7a7a', marginLeft: '15px'}}>({ moment(rating.createdOn).fromNow()})</span></Typography>
                {
                    rating.phone &&
                    <Typography color='#7a7aa7'>{rating.phone}</Typography>
                }
                <Rating value={rating.rating} readOnly/>
                {
                    rating.message &&
                    <Typography sx={{mt: 2}}>{rating.message}</Typography>
                }

                    
      <Box mt={3} display='flex' justifyContent={'center'}>
          <Pagination count={numOfPages} variant='outlined' color='primary' page={page} onChange={(event, value) => setPage(value)}/>
      </Box>


                </Box>
            ))
        }
   </Box>
  )
}
