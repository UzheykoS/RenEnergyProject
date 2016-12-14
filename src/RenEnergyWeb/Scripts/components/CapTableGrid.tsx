import React = require("react");
import Model = require("../Model");
var Enumerable = require("linq");
import Security = Model.Security;
import Investor = Model.Investor;
import RoundTableRowsGroup from './RoundTableRowsGroup';
import SortType = Model.SortType;

interface ICapTableGridProps {
    securities: Array<Security>;
    investors: Array<Investor>;
    securityNoToInvestors: { [Id: string]: Array<Investor> };
    investorIdToSecurities: { [Id: string]: Array<Security> };
    sortType: SortType;
    includeDebt: boolean;
}

export default class CapTableGridElement extends React.Component<ICapTableGridProps, CapTableGridElement> {
    constructor(props: ICapTableGridProps) {
        super(props);
    }

    formatNumber(number) {
        return !!number ? number.toLocaleString('en-US') : 0;
    }

    renderWithNoSort() {
        let roundTableRows = new Array<any>();
        let totalDilutedPercentage = 0;
        let totalUndilutedPercentage = 0;
        let totalQuantity = 0;
        let totalUndilutedQuantity = 0;
        let securityIdToColumnFooter = {};

        this.props.investors.forEach((i) => {
            totalQuantity += Enumerable.from(this.props.investorIdToSecurities[i.Id]).
                sum(s => this.props.includeDebt ? s.AmountShare : s.QuantityShare);
            totalUndilutedQuantity += Enumerable.from(this.props.investorIdToSecurities[i.Id]).
                sum(s => s.FullyDiluted ? 0 : (this.props.includeDebt ? s.AmountShare : s.QuantityShare));
        });

        this.props.investors.forEach((i, index) => {
            let cellsForSecurityColumns = new Array<any>();
            let dilutedInvestorQty = 0;    
            let undilutedInvestorQty = 0;           

            this.props.securities.forEach((s, index2) => {    
                if (!securityIdToColumnFooter[s.Id]) {
                    securityIdToColumnFooter[s.Id] = 0;
                }        
                let security = Enumerable.from(this.props.investorIdToSecurities[i.Id]).firstOrDefault(x => x.Id == s.Id);
                if (!security) {
                    cellsForSecurityColumns.push(<td key={index2}>
                        <span className="row-parent-data">{" - "}</span>
                    </td>);
                }
                else {
                    let qty = this.props.includeDebt ? security.AmountShare : security.QuantityShare;
                    securityIdToColumnFooter[security.Id] += qty;
                    if (security.FullyDiluted) {
                        dilutedInvestorQty += qty;
                    }
                    else {
                        undilutedInvestorQty += qty;
                    }

                    cellsForSecurityColumns.push(<td key={index2}>
                        <span className="row-parent-data">{this.formatNumber(qty)}</span>
                    </td>);
                }                                
            });

            let diluted = ((dilutedInvestorQty + undilutedInvestorQty) / totalQuantity) * 100;
            let undiluted = (undilutedInvestorQty / totalUndilutedQuantity) * 100;
            totalDilutedPercentage += diluted;
            totalUndilutedPercentage += undiluted;

            roundTableRows.push(<tr key={index}>
                <td className="first-column">
                    <span className="row-parent-label">{i.Name}</span>
                </td>
                {cellsForSecurityColumns}
                <td>
                    <span className="row-parent-data">{this.formatNumber(dilutedInvestorQty + undilutedInvestorQty)}</span>
                </td>
                <td>
                    <span className="row-parent-data">{diluted.toFixed(2) + "%"}</span>
                </td>
                <td>
                    <span className="row-parent-data">{undiluted.toFixed(2) + "%"}</span>
                </td>
            </tr>);                        
        });

        let securityColumnHeaders = this.props.securities.map((s, index) => {
            return <th key={index}>{s.Name}</th>;
        })

        let securityColumnFooters = new Array<any>();
        for(let key in securityIdToColumnFooter) {
            securityColumnFooters.push(<td key={key}>{this.formatNumber(securityIdToColumnFooter[key])}</td>);
        };

        return <div>
            <table className="grid cap-table-grid">
                <thead>
                    <tr>
                        <th className="first-column">Investors</th>
                        {securityColumnHeaders}
                        <th>Total</th>
                        <th>Diluted</th>
                        <th>Undiluted</th>
                    </tr>
                </thead>
                <tbody>
                    {roundTableRows}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="first-column"/>
                        {securityColumnFooters}
                        <td>
                            <span>{this.formatNumber(totalQuantity)}</span>
                        </td>
                        <td>
                            <span>{Math.round(totalDilutedPercentage) + "%"}</span>
                        </td>
                        <td>
                            <span>{Math.round(totalUndilutedPercentage) + "%"}</span>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>;
    }

    componentWillReceiveProps(nextProps: ICapTableGridProps) {
        if (!!nextProps) {
            nextProps.investors.sort((a, b) => { return a.Name.localeCompare(b.Name) });
            nextProps.securities.sort((a, b) => { return a.Name.localeCompare(b.Name) });
        }        
    }

    render() {
        if (this.props.sortType == SortType.CapTable) {
            return this.renderWithNoSort();
        }

        let roundTableRowsGroups = new Array<any>();
        let totalPercentage = 0;
        let totalQuantity = 0;

        if (this.props.sortType == SortType.ShareClass) {
            this.props.securities.forEach((s, i) => {
                roundTableRowsGroups.push(<RoundTableRowsGroup
                    {...this.props}
                    key={i}
                    parent={s}
                    sortByShareClass={true}
                    children={this.props.securityNoToInvestors[s.Id].sort((a, b) => { return a.Name.localeCompare(b.Name) })} />);

                totalPercentage += this.props.includeDebt ? s.AmountOwnershipPercentShare : s.QuantityOwnershipPercentShare;

                let investors = this.props.securityNoToInvestors[s.Id];
                investors.forEach((i) => {                    
                    totalQuantity += this.props.includeDebt ? i.Amount : i.Quantity;
                });
            });
        }
        else if (this.props.sortType == SortType.ShareHolder) {
            this.props.investors.forEach((inv, i) => {
                roundTableRowsGroups.push(<RoundTableRowsGroup
                    {...this.props}
                    key={i}
                    parent={inv}
                    sortByShareClass={false}
                    children={this.props.investorIdToSecurities[inv.Id].sort((a, b) => { return a.Name.localeCompare(b.Name) })} />);

                totalPercentage += this.props.includeDebt ? inv.AmountOwnershipPercent : inv.QuantityOwnershipPercent;

                let securities = this.props.investorIdToSecurities[inv.Id];
                securities.forEach((s) => {                    
                    totalQuantity += this.props.includeDebt ? s.AmountShare : s.QuantityShare;
                });
            });
        }

        return <div className="grid-main">
            <table className="grid">
                <thead>
                    <tr>
                        <th className="first-column">{this.props.sortType == SortType.ShareClass ? "Securities" : "Investors"}</th>
                        <th>Outstanding</th>
                        <th>Ownership</th>
                    </tr>
                </thead>
                {roundTableRowsGroups}
                <tfoot>
                    <tr>
                        <td/>
                        <td>
                            <span>{this.formatNumber(totalQuantity)}</span>
                        </td>
                        <td>
                            <span>{Math.round(totalPercentage) + "%"}</span>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>;
    }
}