import { connect  } from 'react-redux';
import {logOut} from '../../actions/session_actions';
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
      connect_websocket: ()=>ownProps.connect(ownProps.token),
      logOut: ()=>dispatch(logOut())
    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
