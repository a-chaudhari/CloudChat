import React from 'react';

class ChannelHeader extends React.Component{
  constructor(props){
    super(props);
  }


  handleLeft(){
    // console.log("handle left")
    this.props.toggleDrawers(0);
  }

  handleRight(){
    // console.log("handle right")
    this.props.toggleDrawers(1);
  }


  render(){
    var value = "";
    if(this.props.selectedRoom === null) { }
    else if(this.props.mobile){
      const chunks = this.props.selectedRoom.split(' ');
      value = chunks[1];
    }else{
      value = this.props.selectedRoom;
    }
    return(
      <div className="chatbox-header">
        <i onClick={this.handleLeft.bind(this)} className="fa fa-bars fa-2x header-button" aria-hidden="true"></i>
        <h1>{value}</h1>
        <i onClick={this.handleRight.bind(this)} className="fa fa-user fa-2x header-button" aria-hidden="true"></i>
      </div>
    );
  }
}



import { connect  } from 'react-redux';


const mapStateToProps = (state, ownProps) =>{
  return(
    {
      selectedRoom: state.config.selectedRoom,
      toggleDrawers: ownProps.toggleDrawers,
      mobile: state.config.mobile
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
)(ChannelHeader);
