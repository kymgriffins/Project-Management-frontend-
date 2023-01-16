import React, {useState, useEffect} from 'react'
import axios from 'axios'


const URL ='http://127.0.0.1:8000/tasks/'
const Tasks = () => {
    const [tasks, setTasks] = useState()
    const fetchTasks =()=>{
        axios.get(URL).then((response)=>{
            setTasks(response.data).catch(error => console.log("This is the error",error))
        })
    }
    useEffect(()=>{
        fetchTasks();
    },[])
   console.log("Tasks", tasks)
const displayTasks =()=>{
    if(tasks?.length > 0){
        return(
            tasks.map((task, index)=>{
                console.log(task)
                return(
                    <>
                    {task.name}
                    {task.description}
                    {task.priority}
                    {task.planned_budget}
                    {task.planned_end_date}
                    {task.planned_start_date}
                    {task?.project_id?.name}
                    {task.status}
                    {task.team?.name}
                    </>
                )
            })
        )
    }
}
  return (
    <div>
        {displayTasks()}
    </div>
  )
}

export default Tasks