import React, { useState, useEffect } from "react";
import axios from "axios";

const URL = "http://127.0.0.1:8000/teams/";
const Teams = () => {
  const [teams, setTeams] = useState();
  const [members, setMembers] = useState();
  const fetchTeams = () => {
    axios.get(URL).then((response) => {
      setTeams(response.data).catch((error) =>
        console.log("This is the error", error)
      );
    });
  };
  useEffect(() => {
    fetchTeams();
  }, []);
  console.log("Members", members);
  const displayTeams = () => {
    if (teams?.length > 0) {
      return teams.map((team, index) => {
        console.log(team);
        // team.members.map((member, index) => setMembers(member));

        return (
          <>
            {team.name}
            {team.description}

            {team.status}
          </>
        );
      });
    }
  };
//   const displayMembers=()=>{
//  if(members.length>0){
//     return members.map((member, index)=>
//         console.log("Function ",member)   
//     )
//   }}
  return <div>{displayTeams()}</div>;
};

export default Teams;
