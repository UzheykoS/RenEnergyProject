import Redux = require("redux")
import Ajax from "../reducers/Ajax"
import CapTable from "../reducers/CapTable"
import Settings from "../reducers/Settings"

const Application = Redux.combineReducers({
    Ajax,
    CapTable,
    Settings
});

export default Application