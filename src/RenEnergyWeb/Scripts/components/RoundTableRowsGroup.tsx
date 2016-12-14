import React = require("react");
import Model = require("../Model");
var Enumerable = require("linq");
import Security = Model.Security;
import Investor = Model.Investor;

interface IRoundTableRowsGroupProps {
    parent: any;
    children: Array<any>;
    sortByShareClass: boolean;
    includeDebt: boolean;
}

interface IRoundTableRowsGroupState {
    isVisible: boolean;
}

export default class RoundTableRowsGroup extends React.Component<IRoundTableRowsGroupProps, IRoundTableRowsGroupState> {
    constructor(props: IRoundTableRowsGroupProps) {
        super(props);

        this.state = {
            isVisible: true
        }
    }

    toggleRowGroup() {
        let visible = this.state.isVisible;
        this.setState({
            isVisible: !visible
        });
    }

    onEditableCellFocus(ev) {
        ev.target.select();
    }

    calculateSecurityPercentageValue() {
        return this.props.includeDebt ? this.props.parent.AmountOwnershipPercentShare : this.props.parent.QuantityOwnershipPercentShare;
    }

    calculateSecurityQuantityValue() {
        let result = 0;

        this.props.children.forEach((c) => {
            result += this.props.includeDebt ? c.Amount : c.Quantity
        });

        return result;
    }

    calculateInvestorPercentageValue() {
        return this.props.includeDebt ? this.props.parent.AmountOwnershipPercent : this.props.parent.QuantityOwnershipPercent;
    }

    calculateInvestorQuantityValue() {
        let result = 0;

        this.props.children.forEach((c) => {
            result += this.props.includeDebt ? c.AmountShare : c.QuantityShare
        });

        return result;
    }

    formatNumber(number) {
        return !!number ? number.toLocaleString('en-US') : 0;
    }

    renderChildRows(children) {
        if (!children) {
            return;
        }
        
        return children.map((child) => {
            return <tr key={child.Id} className={this.state.isVisible ? "group-visible" : "control-hidden"}>
                <td className="first-column">
                    <span className="row-child-label">{child.Name}</span>
                </td>
                <td>
                    <span className="row-child-data">{this.props.sortByShareClass ?
                        (this.props.includeDebt ? this.formatNumber(child.Amount) : this.formatNumber(child.Quantity)) :
                        (this.props.includeDebt ? this.formatNumber(child.AmountShare) : this.formatNumber(child.QuantityShare))}</span>
                </td>
                <td>
                    <span className="row-child-data">{this.props.sortByShareClass ?
                        (this.props.includeDebt ? child.AmountOwnershipPercent.toFixed(2) + "%" : child.QuantityOwnershipPercent.toFixed(2) + "%") :
                        (this.props.includeDebt ? child.AmountOwnershipPercentShare.toFixed(2) + "%" : child.QuantityOwnershipPercentShare.toFixed(2) + "%")}</span>
                </td>             
            </tr>
        });
    }

    render() {
        let result = [];
        let securityPercentage = this.props.sortByShareClass ? this.calculateSecurityPercentageValue() : this.calculateInvestorPercentageValue();
        let securityQuantity = this.props.sortByShareClass ? this.calculateSecurityQuantityValue() : this.calculateInvestorQuantityValue();

        result.push(<tr key={this.props.parent.Id}>
            <td className="first-column">
                <span className={"arf-arrow toggle-group " + (this.state.isVisible ? "rotate-90" : "")} onClick={() => this.toggleRowGroup()}/>
                <span className="row-parent-label" onClick={() => this.toggleRowGroup()}>{this.props.parent.Name}</span>
                <div className="row-parent-sublabel">
                    {this.props.sortByShareClass ? this.props.children.length + " investor(s)" : this.props.children.length + " securities"}
                </div>
            </td>
            <td>
                <span className="row-parent-data">{this.formatNumber(securityQuantity)}</span>
            </td> 
            <td>
                <span className="row-parent-data">{securityPercentage.toFixed(2) + "%"}</span>
            </td> 
        </tr>);

        result.push(this.renderChildRows(this.props.children));

        return <tbody>
            {result}
        </tbody>;
    }
}