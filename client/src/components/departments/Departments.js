import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function Departments() {
  return (
    <div>
      <Button component={Link} to={"/admin/departments/edit/646cbd100859dc92b2ae1baa"}> Edit Department</Button>
    </div>
  )
}

export default Departments
