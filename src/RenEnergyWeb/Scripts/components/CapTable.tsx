import React = require("react");
import Model = require("../Model");
import CapTableGrid from "./CapTableGrid";
import FilterMode = Model.FilterMode;
import Security = Model.Security;
import Investor = Model.Investor;
import SortType = Model.SortType;

interface ICapTableProps {
    securities: Array<Security>;
    investors: Array<Investor>;
    securityNoToInvestors: { [Id: string]: Array<Investor> };
    investorIdToSecurities: { [Id: string]: Array<Security> };
    dates: Array<any>;
    firmId: string;
    roundId: string;
    includeDebt: boolean;
    allowEditCapTableRounds: boolean;

    onDateChanged: (date, firmId) => void;
    onCreateNewRoundClick: (firmId) => void;
    onSelectedTabChanged: (sortType: SortType) => void;
    onRoundEditClick: (roundId, firmId) => void;
}

interface ICapTableState {
    activeTab: SortType;
}

export default class CapTableElement extends React.Component<ICapTableProps, ICapTableState> {
    private m_select: HTMLSelectElement;

    constructor(props: ICapTableProps) {
        super(props);

        this.state = {
            activeTab: 0
        }
    }

    mapRoundEditClickToAction() {
        this.props.onRoundEditClick(this.props.roundId, this.props.firmId);
    }

    mapDateChangedToAction(ev) {
        this.props.onDateChanged(ev.target.value, this.props.firmId);
    }

    mapCreateNewRoundClickToAction() {
        this.props.onCreateNewRoundClick(this.props.firmId);
    }

    onTabSelected(ev, sortType: SortType) {
        let i, tablinks;
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        ev.target.className += " active";

        this.setState({ activeTab: sortType });
        this.props.onSelectedTabChanged(sortType);
    }

    renderHeader() {
        return <div className="top-controls">            
        </div>;
    }

    renderTabs() {
        return <ul className="tab">
            <li><a href="javascript:void(0)" className="tablinks active" onClick={ev => this.onTabSelected(ev, SortType.CapTable)}>CAP TABLE</a></li>
            <li><a href="javascript:void(0)" className="tablinks" onClick={ev => this.onTabSelected(ev, SortType.ShareClass)}>BY SHARE CLASS</a></li>
            <li><a href="javascript:void(0)" className="tablinks" onClick={ev => this.onTabSelected(ev, SortType.ShareHolder)}>BY SHAREHOLDERS</a></li>
            <li><a href="javascript:void(0)" className="tablinks" onClick={ev => this.onTabSelected(ev, SortType.Report)}>REPORTS</a></li>
        </ul>;
    }

    render() {
        if (this.state.activeTab == SortType.Report) {
            return <div>
                <div className="banner">
                    <span className="arf-logo_peak banner-logo" />
                    <span className="banner-text">Capitalization Table</span>
                </div>
                {this.renderHeader()}
                <div>
                    {this.renderTabs()}
                    <div>
                        <div className="control">
                            <span style={{ fontWeight: "bold" }}>{"Export to .xls or something"}</span>
                        </div>
                        <div>
                            <span className="control">{"Some option: "}</span>
                            <input className="control" type="checkbox" />
                        </div>
                        <div>
                            <span className="control">{"Some other option: "}</span>
                            <input className="control" type="checkbox" defaultChecked />
                        </div>
                        <div className="control">
                            <input type="button" value="Apply" />
                        </div>
                    </div>
                </div>
            </div>;
        }
        
        return <div>
            <div className="banner">
                <span className="arf-logo_peak banner-logo" />
                <span className="banner-text">Capitalization Table</span>
            </div>
            {this.renderHeader()}
            <div>
                {this.renderTabs()}
                <CapTableGrid sortType={this.state.activeTab} {...this.props}/>                
            </div>
        </div>;
    }
}
// <CapTableGrid sortType={this.state.activeTab} {...this.props}/>    