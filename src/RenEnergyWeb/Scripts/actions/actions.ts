import Model = require("../Model")
import EntityReference = Model.EntityReference;

enum ActionsEnum {
    OpenAjax,
    CloseAjax,
    AddSetting,
    AddContent,
    CreateNewRound,
    EditRound,
    SelectedTabChanged
}

const addContent = (data) => {
    return {
        type: ActionsEnum.AddContent,
        result: data
    }
}

const ajaxOpen = (url, type, asOfDate, data, callback) => {
    return {
        type: ActionsEnum.OpenAjax,
        url: url,
        ttype: type,
        asOfDate: asOfDate,
        data: data,
        callback: callback        
    }
}

const ajaxClose = () => {
    return {
        type: ActionsEnum.CloseAjax
    }
}

const addSetting = (n, v) => {
    return {
        type: ActionsEnum.AddSetting,
        name: n,
        value: v
    }
}

const createNewRound = (firmId) => {
    return {
        type: ActionsEnum.CreateNewRound,
        firmId: firmId
    }
}

const editRound = (roundId, firmId) => {
    return {
        type: ActionsEnum.EditRound,
        roundId: roundId,
        firmId: firmId
    }
}

const selectedTabChanged = (sortType) => {
    return {
        type: ActionsEnum.SelectedTabChanged,
        sortType: sortType
    }
}

export default {
    ActionsEnum,
    ajaxOpen,
    ajaxClose,
    addSetting,
    addContent,
    createNewRound,
    editRound,
    selectedTabChanged
}