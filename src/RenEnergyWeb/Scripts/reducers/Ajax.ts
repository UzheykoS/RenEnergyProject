import Actions from "../actions/actions";
import app from "../App"

const Ajax = (state = { count: 0 }, action) => {
    switch (action.type) {
        case Actions.ActionsEnum.OpenAjax:
            return Object.assign({}, {
                url: action.url, data: action.data, type: action.ttype, asOfDate: !!action.asOfDate ? action.asOfDate.toISOString() : action.asOfDate, callback: action.callback, count: ++state.count
            });
        case Actions.ActionsEnum.CloseAjax:
            return Object.assign({}, { count: --state.count });
        default:
            return state;
    }
}
export default Ajax;

