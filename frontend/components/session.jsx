import React from 'react';

class Session extends React.Component{
  constructor(props){
    super(props);
    this.state={
      username:"",
      password:"",
      new_user:"",
      new_pass:""
    }
  }

  update(field){
    return (e)=> this.setState({[field]:e.target.value})
  }

  handleSignup(e){
    e.preventDefault();
    console.log("sign up!")
    this.props.signUp({username: this.state.new_user,password:this.state.new_pass});
  }

  handleLogin(e){
    e.preventDefault();
    console.log("log in!")
    this.props.logIn({username: this.state.username, password: this.state.password})
  }

  guestLogin(){
    this.props.logIn({username: "guest", password:"password"});
  }

  render(){
    return(
      <div className="session-container">
        <div className="session-login">
          <h2>session sign IN form</h2>
          <form onSubmit={this.handleLogin.bind(this)}>
            <label>Username:
              <input value={this.state.username} onChange={this.update("username").bind(this)}/>
            </label>
            <label>Password:
              <input type="password" value={this.state.password} onChange={this.update("password").bind(this)}/>
            </label>
            <button onClick={this.handleLogin.bind(this)}>Log In</button>
            <button onClick={this.guestLogin.bind(this)}>Demo Auto Log In</button>
          </form>
        </div>
        <div className="session-signup">
          <h2>session sign UP form</h2>
          <form onSubmit={this.handleSignup.bind(this)}>
            <label>Username:
              <input value={this.state.new_user} onChange={this.update("new_user").bind(this)}/>
            </label>
            <label>Password:
              <input type="password" value={this.state.new_pass} onChange={this.update("new_pass").bind(this)}/>
            </label>
            <button onClick={this.handleSignup.bind(this)}>Sign UP</button>
          </form>
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
