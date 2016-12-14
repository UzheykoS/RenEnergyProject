import React = require("react")
import Ajax from "../containers/Ajax"
import CapTable from "../containers/CapTable"

const Body = () => (
    <div className="metro">
        <Ajax />
        <CapTable />
    </div>
);

export default Body