import React from 'react'

class Channel extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    // debugger
    const msgs = this.props.messages.messages.map((line,idx)=>(
      <li key={`msg${idx}`}>{line}</li>
    ))
    return(
      <div className="channel">
        <ul>
          {msgs}
        </ul>
      </div>
    );
  }
}

import { connect  } from 'react-redux';


const mapStateToProps = (state, ownProps) =>{
  return(
    {
      messages: state.messages
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
)(Channel);
