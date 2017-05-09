import React from 'react';
import Modal from 'react-modal';

class UserBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      timestamps: this.props.settings.timestamps,
      closeKB: this.props.settings.closeKB,
      modalOpen: false
    };
  }

  logOut(e){
    e.preventDefault();
    this.props.logOut();
  }

  toggle(field){
    return (e)=>{
      this.setState({[field]: e.target.checked});
    };
  }

  submitSettings(e){
    e.preventDefault();
    this.props.newSettings({
      timestamps: this.state.timestamps,
      closeKB: this.state.closeKB
    });
    this.setState({modalOpen: false});
  }

  closeModal(e){
    e.preventDefault();
    this.setState({
      timestamps: this.props.settings.timestamps,
      closeKB: this.props.settings.closeKB,
      modalOpen: false
    });
  }

  openModal(){
    this.setState({modalOpen: true});
  }

  renderSettingsModal(){
    return(
      <Modal
        isOpen={this.state.modalOpen}
        contentLabel = "settings modal"
        onRequestClose={this.closeModal.bind(this)}
        className="userbox-settings-modal"
      >
        <div className="modal-header">
          <h1>Settings</h1>
        </div>
        <div>
          <form onSubmit={this.submitSettings.bind(this)}>
            <label>
              <input type="checkbox"
                checked={this.state.timestamps}
                onChange={this.toggle('timestamps').bind(this)}/>
              <span> Show timestamps</span>
            </label>
            <label>
              <input type="checkbox"
                     checked={this.state.closeKB}
                     onChange={this.toggle('closeKB').bind(this)}/>
              <span> Mobile: Close keyboard after sending</span>
            </label>
            <button onClick={this.submitSettings.bind(this)}>Save</button>
            <button onClick={this.closeModal.bind(this)}>Cancel</button>
          </form>
        </div>
      </Modal>
    );
  }

  render(){
    return(
      <div className="chatbox-userbox">
        <nav>
          <div className="userbox-element">{this.props.session.username}</div>
          <div onClick={this.openModal.bind(this)}
               className="userbox-element">
               <i className="fa fa-cog" aria-hidden="true"/>settings
           </div>
          <div onClick={this.logOut.bind(this)}
               className="userbox-element">
               <i className="fa fa-sign-out" aria-hidden="true"/>logout
          </div>
        </nav>
        {this.renderSettingsModal()}
      </div>
    );
  }
}


import { connect  } from 'react-redux';
import {newSettings} from '../../actions/configuration_actions';

const mapStateToProps = (state, ownProps) =>{
  return(
    {
      settings: state.config.settings,
      session: state.session.session
    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {
      newSettings: (obj)=>dispatch(newSettings(obj))
    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserBox);
