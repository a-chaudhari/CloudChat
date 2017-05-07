import React from 'react';

class ChannelMemberList extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    let users = [];

    if(this.props.userlist !== undefined){
      users = this.props.userlist
    }
    users=users.sort()
    const user_els = users.map((el,idx)=>{
      return(
        <div className="chatbox-user-entry" key={`usrentry${idx}`}>{el}</div>
      );
    })
    return(
      <div className={"chatbox-userlist" + (this.props.show ? "": " hidden")}>
        <div className="userlist-count">{user_els.length} Users</div>
        {user_els}
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
