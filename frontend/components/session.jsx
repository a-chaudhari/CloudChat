import React from 'react';

class Session extends React.Component{
  constructor(props){
    super(props);
    this.state={
      username:"",
      password:"",
      errors:{}
    };
  }

  update(field){
    return (e)=> this.setState({[field]:e.target.value});
  }

  handleSignup(e){
    e.preventDefault();
    if(!this.validate()) return;
    this.props.signUp({username: this.state.username,
                       password:this.state.password});
  }

  handleLogin(e){
    e.preventDefault();
    if(!this.validate()) return;
    this.props.logIn({username: this.state.username,
                      password: this.state.password});
  }

  guestLogin(e){
    e.preventDefault();
    this.props.logIn({username: "guest", password:"password"});
  }

  validate(){
    let errors = {};
    if(this.state.username === ""){
      errors['username'] = "Username cannot be empty";
    }else if (this.state.username.length < 3) {
      errors['username'] = "Username must be at least 3 characters";
    }
    if(this.state.password === ""){
      errors['password'] = "Password cannot be empty";
    }
    const passed = Object.keys(errors).length === 0;
    if(!passed){
      this.setState({errors: errors});
    }
    return passed;
  }

  render(){
    return (
      <div className="session-container">
        <div className="session-header">
          <i className="cloudchat-logo fa fa-cloud" aria-hidden="true"/>
          <span className="cloudchat-script">CloudChat</span>
        </div>
        <form onSubmit={this.handleLogin.bind(this)}>
          <div className="session-input">
            <label>
              <span>Username</span>
            </label>
            <input value={this.state.username}
              onChange={this.update('username').bind(this)}/>
            <div className="session-error">{this.state.errors.username}</div>
          </div>
          <div className="session-input">
            <label>
              <span>Password </span>
            </label>
            <input value={this.state.password}
              type="password"
              onChange={this.update('password').bind(this)}/>
            <div className="session-error">
              {this.state.errors.password}</div>
          </div>
        </form>
        <div className="session-buttons">
          <button onClick={this.handleSignup.bind(this)}>Sign Up</button>
          <button onClick={this.handleLogin.bind(this)}>Log In</button>
          <button className="guest-button"
            onClick={this.guestLogin.bind(this)}>
            Guest Account Sign In
          </button>
        </div>
      </div>
    );
  }
}


import { connect  } from 'react-redux';
import {signUp, logIn, logOut} from '../actions/session_actions';

const mapStateToProps = (state, ownProps) =>{
  return(
    {

    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {
      logIn: (info)=>dispatch(logIn(info)),
      signUp: (info)=>dispatch(signUp(info))
    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Session);
