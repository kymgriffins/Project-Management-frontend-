import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate, useLocation} from 'react-router-dom'

const URL ='http://127.0.0.1:8000/projects/'

const Projects = () => {
    const navigate = useNavigate()
    const location = useLocation()
    console.log("location", location.state)
    const [projects, setProjects] = useState()
    const fetchProjects =()=>{
        axios.get(URL).then((response)=>{
            setProjects(response.data).catch(error => console.log("This is the error",error))
        })
    }
    useEffect(()=>{
        fetchProjects();
    },[])
//    console.log("Projects", projects)
   const displayProjects =()=>{
    if(projects?.length > 0){
        return(
            projects.map((project, index)=>{
                // console.log(project)
                return(
                    <>
                     {project.id}
                    {project.name}
                    {project.description}
                    {project.scope}
                    {project.start_date}
                    {project.end_date}
                    {project.estimated_budget}
                    {project?.current_budget}
                    {project.status}
                    {project.team?.name}
                    {/* <button onClick={navigate(`/project/`,{state:{id: project.name}})}>View</button> */}
                    </>
                )
            })
        )
    }
}
  return (
    <div>{displayProjects()}</div>
  )
}

export default Projects