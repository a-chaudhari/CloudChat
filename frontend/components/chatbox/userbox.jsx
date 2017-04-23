import React from 'react'

class UserBox extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="chatbox-userbox">
        <nav>
          <div className="userbox-element">username</div>
          <div className="userbox-element">settings</div>
          <div className="userbox-element">logout</div>
        </nav>
      </div>
    );
  }
}

export default UserBox;
