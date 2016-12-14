import React = require("react")
import ReactDOM = require("react-dom")
import Redux = require("redux");
import ReactRedux = require("react-redux");
import $ = require("jquery");
import Model = require("./Model")
require("es6-shim");
require("!style!css!sass!../Styles/Page.scss");
require("!style!css!sass!../Styles/ar-font/ar-font-bootstrapper.css");
require("file?name=[path][name].[ext]!../app.json");

const Provider = ReactRedux.Provider;
const createStore = Redux.createStore;

import Actions from "./actions/actions"
import Application from "./reducers/Application"
import Body from "./components/Body"
const store = createStore(Application);

var root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);


ReactDOM.render(
    <Provider store={store}>
        <Body />
    </Provider>,
    document.getElementById("root")
);

const parseUrlParams = (customUrl?) => {
    var query_string = {};
    var query = customUrl ? customUrl : window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}

class App {
    constructor() {
        this.initialize("");
    }

    initialize = (params) => {
        store.dispatch(Actions.ajaxOpen(null, null, null, null, null));
        $.getJSON("app.json",
            "",
            (settings) => {
                store.dispatch(Actions.addSetting("webApiUrl", settings.WebApiUrl));
                this.initializeList(settings);
                store.dispatch(Actions.ajaxClose());
            });
    };

    initializeList = (settings) => {        
        store.dispatch(Actions.ajaxOpen(settings.WebApiUrl, "GET", null, {}, (r) => {
            store.dispatch(Actions.addContent(r));
        }));
    };
}
const app = new App();
export default app;