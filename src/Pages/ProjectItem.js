import React, {useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
const ProjectItem = () => {
    const location = useLocation()
    const [name, setName]=useState()
    console.log(location.state)
    setName(location.state)
  return (
    <div>{name}</div>
  )
}

export default ProjectItem