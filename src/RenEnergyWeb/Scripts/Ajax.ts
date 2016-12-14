import $ = require("jquery");

class Ajax {
    static ErrorHandler(xhr, ajaxOptions, thrownError) {
        console.log("Error (" + thrownError + "):" + xhr.responseText);
        $["Notify"]({
            caption: thrownError,
            content: xhr.responseText,
            type: 'alert',
            keepOpen: false,
            timeout: 30000
        });
    }

    static Get<T>(url: string, callback: (result: T) => void, error?: (error) => void): JQueryXHR {
        return $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            success: (result: T) => {
                (result["count"] && result["value"]) ? callback(<T>result["value"]) : callback(<T>result);
            },
            error: error || this.ErrorHandler
        });
    }

    static Post<T, R>(url: string, data: T, callback?: (result: R) => void, error?: (error) => void): JQueryXHR {
        return $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            /*xhrFields: {
                withCredentials: true
            },*/
            success: (result: R) => {
                if (callback)
                    callback(result);
            },
            error: error || this.ErrorHandler
        });
    }
}

export = Ajax;  