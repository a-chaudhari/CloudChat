import React from 'react';

class ChannelMemberList extends React.Component{
  constructor(props){
    super(props);
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
        <div className="chatbox-user-entry" key={`usrentry${idx}`}>{el}</div>
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
      selectedRoom: state.config.selectedRoom
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
