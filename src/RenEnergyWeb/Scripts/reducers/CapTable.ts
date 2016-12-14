import Actions from "../actions/actions";
var Enumerable = require("linq");
import Model = require("../Model");
import Security = Model.Security;
import Investor = Model.Investor;
import SortType = Model.SortType;

const CapTable = (state = {
    securities: [],
    securityNoToInvestors: {},
    investorIdToSecurities: {},
    investors: [],
    dates: [],
    roundId: "",
    sortType: SortType.CapTable,
    includeDebt: false,
    allowEditCapTableRounds: false
},
    action) => {
    switch (action.type) {
        case Actions.ActionsEnum.AddContent:
            let data = action.result;
            let securities: Array<Security> = [];
            let investors: Array<Investor> = [];
            let securityNoToInvestors: { [Id: string]: Array<Investor> } = {};
            let investorIdToSecurities: { [Id: string]: Array<Security> } = {};

            data.Lines.forEach((d) => {
                let securityId: string = d["SecurityId"];

                if (!securityNoToInvestors[securityId]) {
                    securities.push({
                        Id: securityId,
                        Name: d["SecurityName"],
                        QuantityShare: 0,
                        QuantityOwnershipPercentShare: 0,
                        AmountShare: 0,
                        AmountOwnershipPercentShare: 0,
                        FullyDiluted: d["FullyDiluted"]
                    });
                    securityNoToInvestors[securityId] = [];
                }

                let investor = {
                    Name: !!d["InternalInvestorName"] ? d["InternalInvestorName"] : d["ExternalInvestorName"],
                    Id: !!d["InternalInvestorId"] ? d["InternalInvestorId"] : d["ExternalInvestorId"],
                    Quantity: d["Quantity"],
                    QuantityOwnershipPercent: 0,
                    Amount: d["Amount"],
                    AmountOwnershipPercent: 0,
                    IsInternal: !!d["InternalInvestorName"]
                };

                securityNoToInvestors[securityId].push(investor);

                let investorId: string = !!d["InternalInvestorId"] ? d["InternalInvestorId"] : d["ExternalInvestorId"];
                if (!investorIdToSecurities[investorId]) {
                    investors.push({
                        Name: !!d["InternalInvestorName"] ? d["InternalInvestorName"] : d["ExternalInvestorName"],
                        Id: !!d["InternalInvestorId"] ? d["InternalInvestorId"] : d["ExternalInvestorId"],
                        Quantity: d["Quantity"],
                        QuantityOwnershipPercent: 0,
                        IsInternal: !!d["InternalInvestorName"],
                        Amount: d["Amount"],
                        AmountOwnershipPercent: 0,
                    });
                    investorIdToSecurities[investorId] = [];
                }

                investorIdToSecurities[investorId].push({
                    Id: d["SecurityId"],
                    Name: d["SecurityName"],
                    QuantityShare: d["Quantity"],
                    QuantityOwnershipPercentShare: 0,
                    AmountShare: d["Amount"],
                    AmountOwnershipPercentShare: 0,
                    FullyDiluted: d["FullyDiluted"]
                })
            });

            let totalQty = 0;
            let totalAmout = 0;
            let securityTotalQty;
            let securityTotalAmount;

            securities.forEach((s) => {
                securityTotalQty = Enumerable.from(securityNoToInvestors[s.Id]).sum(x => x.Quantity);
                securityTotalAmount = Enumerable.from(securityNoToInvestors[s.Id]).sum(x => x.Amount);

                s.QuantityShare = securityTotalQty;
                s.AmountShare = securityTotalAmount;

                totalQty += securityTotalQty;
                totalAmout += securityTotalAmount;

                securityNoToInvestors[s.Id].forEach((i) => {
                    i.QuantityOwnershipPercent = (i.Quantity / securityTotalQty) * 100;
                    i.AmountOwnershipPercent = (i.Amount / securityTotalAmount) * 100;
                })
            });

            securities.forEach((s) => {
                s.QuantityOwnershipPercentShare = (s.QuantityShare / totalQty) * 100;
                s.AmountOwnershipPercentShare = (s.AmountShare / totalAmout) * 100;
            });

            totalQty = 0;
            totalAmout = 0;
            let investorTotalQty;
            let investorTotalAmount;

            investors.forEach((i) => {
                investorTotalQty = Enumerable.from(investorIdToSecurities[i.Id]).sum(x => x.QuantityShare);
                investorTotalAmount = Enumerable.from(investorIdToSecurities[i.Id]).sum(x => x.AmountShare);

                i.Quantity = investorTotalQty;
                i.Amount = investorTotalAmount;

                totalQty += investorTotalQty;
                totalAmout += investorTotalAmount;

                investorIdToSecurities[i.Id].forEach((s) => {
                    s.QuantityOwnershipPercentShare = (s.QuantityShare / investorTotalQty) * 100;
                    s.AmountOwnershipPercentShare = (s.AmountShare / investorTotalAmount) * 100;
                })
            });

            investors.forEach((i) => {
                i.QuantityOwnershipPercent = (i.Quantity / totalQty) * 100;
                i.AmountOwnershipPercent = (i.Amount / totalAmout) * 100;
            });

            state.securities = securities;
            state.investors = investors;
            state.securityNoToInvestors = securityNoToInvestors;
            state.investorIdToSecurities = investorIdToSecurities;
            state.roundId = data.RoundId;
            state.includeDebt = data.Settings.IncludeDebt
            state.allowEditCapTableRounds = data.Settings.AllowEditCapTableRounds;

            state.dates = [];
            data.Rounds.forEach((d) => {
                state.dates.push(new Date(d["RoundDate"]));
            });

            state.dates.sort((a, b) => {
                return b.getTime() - a.getTime();
            });

            return Object.assign({}, state);

        case Actions.ActionsEnum.CreateNewRound:
            window.location.href = "../CapTableNewRound/index.html?data=" + encodeURIComponent("firmId=" + action.firmId);
            return Object.assign({}, state);

        case Actions.ActionsEnum.SelectedTabChanged:
            state.sortType = action.sortType;
            return Object.assign({}, state);

        case Actions.ActionsEnum.EditRound:
            window.location.href = "../CapTableNewRound/index.html?data=" + encodeURIComponent("firmId=" + action.firmId + "&roundId=" + action.roundId);
            return Object.assign({}, state);

        default:
            return state;
    }
}
export default CapTable;