import Actions from "../actions/actions";

const Settings = (state = {}, action) => {
    switch (action.type) {
        case Actions.ActionsEnum.AddSetting:
            state[action.name] = action.value;
            return Object.assign({}, state);
        default:
            return state;
    }
}
export default Settings;