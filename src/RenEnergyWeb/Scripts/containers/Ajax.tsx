import ReactRedux = require("react-redux")
import AjaxElement from "../components/Ajax"
import Actions from "../actions/actions"

const msToAjax = (state) => {
    return {
        count: state.Ajax.count,        
        url: state.Settings.webApiUrl,
        type: state.Ajax.type,
        data: state.Ajax.data,
        callback: state.Ajax.callback
    }
}

const mdToAjax = (dispatch) => {
    return {
        onSuccess: () => {
            dispatch(Actions.ajaxClose());
        }
    }
}
const Ajax = ReactRedux.connect(msToAjax, mdToAjax)(AjaxElement);

export default Ajax;