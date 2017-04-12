import React from 'react';

class ChannelMemberList extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const users = new Array(50);
    users.fill("user")
    const user_els = users.map((el,idx)=>{
      return(
        <div className="chatbox-user-entry" key={`usrentry${idx}`}>{el}</div>
      );
    })
    return(
      <div className="chatbox-userlist">
        {user_els}
      </div>
    );
  }
}

export default ChannelMemberList;
