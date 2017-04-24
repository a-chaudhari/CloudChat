import { connect  } from 'react-redux';
import ChatBox from './chatbox';

const mapStateToProps = (state, ownProps) =>{
  return(
    {
      selectedRoom: state.config.selectedRoom
    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {
      connect_websocket: ()=>ownProps.connect(ownProps.token)
    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
