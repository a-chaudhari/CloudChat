import React from 'react'

class UserBox extends React.Component{
  constructor(props){
    super(props);
  }

  logOut(e){
    e.preventDefault();
    this.props.logOut();
  }

  render(){
    return(
      <div className="chatbox-userbox">
        <nav>
          <div className="userbox-element">username</div>
          <div className="userbox-element">settings</div>
          <div onClick={this.logOut.bind(this)} className="userbox-element">logout</div>
        </nav>
      </div>
    );
  }
}

export default UserBox;
