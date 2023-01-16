
import './App.css';
import Projects from './Pages/Projects'
import Tasks from './Pages/Tasks';
import Teams from './Pages/Teams'
import ProjectItem from './Pages/ProjectItem'
import {Routes, Route} from 'react-router-dom'
import AppLayout from './Components/AppLayout';
function App() {
  return (
    <Routes>
      <Route path='/' element={<AppLayout />}>
      <Route path='/projects' element={ <Projects/>}/>
      <Route path="/project/" element={<ProjectItem />} />
      <Route path='/teams' element={ <Teams/>}/>
      <Route path='/tasks' element={ <Tasks/>}/>
      </Route>
    
    </Routes>
  );
}

export default App;
