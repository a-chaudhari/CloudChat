import React from 'react'

class UserBox extends React.Component{
  constructor(props){
    super(props);
  }

  handleLogOut(e){
    e.preventDefault();
    this.props.logOut();
  }

  render(){
    // debugger
    return(
      <div className="userbox-container">
        <h2>Logged in as: {this.props.session.session.username}</h2>
        <button onClick={this.handleLogOut.bind(this)}>Log Out</button>
      </div>
    );
  }
}



import { connect  } from 'react-redux';
import{logOut} from '../actions/session_actions';

const mapStateToProps = (state, ownProps) =>{
  return(
    {
      session: state.session
    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {
      logOut: ()=>dispatch(logOut())
    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserBox);
