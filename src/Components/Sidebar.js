import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import TaskIcon from '@mui/icons-material/Task';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GroupsIcon from '@mui/icons-material/Groups';
import { useAuth } from '../Auth/AuthProvider';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NotesIcon from '@mui/icons-material/Notes';
import HandymanIcon from '@mui/icons-material/Handyman';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import axios  from 'axios';
import { Typography } from '@mui/material';
const sidebarNavItems = [
    {
        display: 'Dashboard',
        icon: <DashboardCustomizeIcon/>,
        to: '/',
        section: 'home',
        roles: ["owner", "architect", "manager", "foreman","contractor"],
    },
    {
        display: 'Projects',
        icon: <AddBusinessIcon/>,
        to: '/projects',
        section: 'projects',
        roles: ["owner", "architect", "manager", "foreman","contractor"],
    },
    {
        display: 'Materials',
        icon: <HandymanIcon/>,
        to: '/materials',
        section: 'materials',
        roles: [ "architect", "manager", "foreman","contractor"],
    },
    // {
    //     display: 'My Tasks',
    //     icon: <TaskIcon/>,
    //     to: '/tasks',
    //     section: 'tasks',
    //     roles: [ "architect", "foreman"],
    // },
    
    // {
    //     display: 'Billing',
    //     icon: <TaskIcon/>,
    //     to: '/billing',
    //     section: 'billing',
    //     roles: [ "member"]

    // },
    {
        display: 'Reports',
        icon: <NotesIcon/>,
        to: '/reports',
        section: 'reports',
        roles: ["owner", "architect", "manager", "foreman"],

    },
    {
        display: 'Invoices',
        icon: <ReceiptIcon/>,
        to: '/invoices',
        section: 'invoices',
        roles: [ "architect",  "foreman", "manager"],

    },
    
    // {
    //     display: 'Meetings',
    //     icon: <TaskIcon/>,
    //     to: '/meetings',
    //     section: 'meetings'
    // }
]

const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [stepHeight, setStepHeight] = useState(0);
    const sidebarRef = useRef();
    const indicatorRef = useRef();
    const location = useLocation();
    const [role, setRole] = useState("");
    const { currentUser } = useAuth();
    console.log(currentUser?.user_id, "USER");
    // find user object with the above user_id in http://127.0.0.1:8000/auth/register/
    const userId = currentUser?.user_id;
    axios
    .get(`http://127.0.0.1:8000/auth/register/`)
    .then((response) => {
      const user = response.data.find((u) => u.id === userId); // Filter user with matching user_id
      console.log(user); // user object
      console.log(user.roles);
      setRole(user.roles);
    })
    .catch((error) => {
      console.log(error);
    });

    useEffect(() => {
        setTimeout(() => {
            const sidebarItem = sidebarRef.current.querySelector('.sidebar__menu__item');
            indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
            setStepHeight(sidebarItem.clientHeight);
        }, 50);
    }, []);

    // change active index
    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1];
        const activeItem = sidebarNavItems.findIndex(item => item.section === curPath);
        setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    }, [location]);
    const filteredSidebarNavItems = sidebarNavItems.filter((item) =>
    item.roles.includes(role)
  );

    return <div className='sidebar'>
        <div className="sidebar__logo">
        <Typography
              variant="h4"
            //   sx={{ letterSpacing: 4, mb: 6 }}
              color="primary"
            >
              {" "}
              JENGA
            </Typography>
        </div>
        <div ref={sidebarRef} className="sidebar__menu">
            <div
                ref={indicatorRef}
                className="sidebar__menu__indicator"
                style={{
                    transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
                }}
            ></div>
            {
                filteredSidebarNavItems.map((item, index) => (
                    <Link to={item.to} key={index}>
                        <div className={`sidebar__menu__item ${activeIndex === index ? 'active' : ''}`}>
                            <div className="sidebar__menu__item__icon">
                                {item.icon}
                            </div>
                            <div className="sidebar__menu__item__text">
                                {item.display}
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    </div>;
};

export default Sidebar;