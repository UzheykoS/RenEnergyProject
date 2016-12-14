import Model = require("../Model");
import ReactRedux = require("react-redux")
import Actions from "../actions/actions";
import CapTable from "../components/CapTable"
import $ = require("jquery");
var Enumerable = require("linq");

const msToComponent = (state) => {
    return {
        securities: state.CapTable.securities,
        securityNoToInvestors: state.CapTable.securityNoToInvestors,
        investorIdToSecurities: state.CapTable.investorIdToSecurities,
        investors: state.CapTable.investors,
        dates: state.CapTable.dates,
        firmId: state.Settings.firmId,
        roundId: state.CapTable.roundId,
        includeDebt: state.CapTable.includeDebt,
        allowEditCapTableRounds: state.CapTable.allowEditCapTableRounds
    }
}

const mdToComponent = (dispatch) => {
    return {
        onDateChanged: (date, firmId) => {
            let newDate = new Date(date);

            dispatch(Actions.ajaxOpen("GetCapTableLinesAsync",
                "GET",
                newDate,
                null,
                (r) => {
                    dispatch(Actions.addContent(r));
                }));
        },
        onCreateNewRoundClick: (firmId) => {
            dispatch(Actions.createNewRound(firmId));
        },
        onSelectedTabChanged: (sortType) => {
            dispatch(Actions.selectedTabChanged(sortType));
        },
        onRoundEditClick: (roundId, firmId) => {
            dispatch(Actions.editRound(roundId, firmId));
        }
}
}
const component = ReactRedux.connect(msToComponent, mdToComponent)(CapTable);

export default component;