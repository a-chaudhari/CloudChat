import React from 'react';

class ChannelMemberList extends React.Component{
  constructor(props){
    super(props);
  }

  handleDoubleClick(nick){
    return (e)=>{
      e.preventDefault();
        const command = {
          command: 'join',
          channel: nick,
          server: this.props.server
        };
        this.props.socket.send(JSON.stringify(command));
    };

  }

  render(){
    let users = [];

    if(this.props.userlist !== undefined){
      users = Object.keys(this.props.userlist).map(key=>(
        this.props.userlist[key]+key
      ));
    }

    users = users.sort();

    const userEls = users.map((el,idx)=>{
      return(
        <div onDoubleClick={this.handleDoubleClick(el).bind(this)}
             className="chatbox-user-entry"
             key={`usrentry${idx}`}>{el}</div>
      );
    });
    return(
      <div className={"chatbox-userlist" + (this.props.show ? "": " hidden")}>
        <div className="userlist-count">{userEls.length} Users</div>
        {userEls}
      </div>
    );
  }
}

import { connect  } from 'react-redux';


const mapStateToProps = (state, ownProps) =>{
  return(
    {
      userlist: state.messages.users[state.config.selectedRoom],
      selectedRoom: state.config.selectedRoom,
      server: state.config.server,
      socket: state.config.socket
    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {

    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelMemberList);
