import React, { Component } from "react"
import Popup from "reactjs-popup"
//import { AssetCategoryEnum } from "../AssetCategoryEnum.js"
import "./AssetCreate.css"
import "reactjs-popup/dist/index.css"
import { DataType } from "../../common/DataType";
//import XLSX from "xlsx"
import * as ASSET from "../../common/Asset.js"

const modalStyle = {
    maxWidth: "1200px",
    width: "80%",
    borderRadius: "10px",
    border: "1px solid #D6D6D6",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)"
}

const formStyle = {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    justifyContent: "center"
}

export default class AssetCreate extends Component {
    constructor(props) {
        super(props)
        this.state = { category: null, asset: null, result: null }
    }

    render() {
        return (
            <Popup
                trigger={<button className="createButton">Create</button>}
                modal={true}
                closeOnEscape={false}
                closeOnDocumentClick={false}
                contentStyle={modalStyle}>
                {close => this.popupContent(close)}
            </Popup>
        )
    }

    popupContent(close) {
        const closeAndReset = event => {
            close(event)
            this.setState({ category: null, asset: null, result: null })
        }

        const labelStyle = color => ({
            display: "flex",
            width: "33.33%",
            color: color,
            margin: "auto",
            fontSize: "20px",
            justifyContent: "center"
        })

        const submit = event => {
            event.preventDefault()
            const category = this.state.category
            const newAsset = {
                "Infrastructure ID": 1,
                "Long Type": "physical server",
                "Short Type": "Phy SVR",
                "Name": "Server-1",
                "Infrastructure Connections": " ",
                "Data Connections": " ",
                "Rack Coordinates": "r15-2",
                "Vendor": "Dell",
                "Model": "d-415",
                "Software": "win 10",
                "Serial Number ": "sn-2248",
                "IP Address": "10.176.138.32",
                "Owner": "George Ito"
            }
            //this.setState({asset: newAsset})
            this.state.asset = newAsset;
            console.log(this.state.asset)
            console.log(newAsset)
            this.pushAssets().then(result => {
                this.setState({ result: result })
            })
        }

        const inputResult = () => {
            const category = this.state.category
            switch (category) {
                case null:
                    return ""
                default:
                    return (
                        <>
                            <label style={labelStyle(category.color)}>
                                {category.name}
                            </label>
                            <button
                                className="loadButton"
                                disabled={this.state.result}
                                type="submit"
                                style={{ width: "33.33%" }}>
                                Confirm
                            </button>
                        </>
                    )
            }
        }

        const validateResult = () => {
            const result = this.state.result
            if (!result) return null
            const error = result["error"]
            if (error)
                return (
                    <div className="createDetails" style={{ color: "red" }}>
                        {error}
                    </div>
                )

            const [imported, duplicate, invalid] = [
                result["imported"],
                result["duplicate"],
                result["invalid"]
            ]
            const importedCount = parseInt(imported)
            return (
                <>
                    <div className="importDetails">
                        <div>
                            Imported: <b>{imported}</b>
                        </div>
                        <div>
                            Duplicate: <b>{duplicate}</b>
                        </div>
                        <div>
                            Invalid: <b>{invalid}</b>
                        </div>
                    </div>
                    {importedCount ? (
                        <div style={{ textAlign: "center" }}>
                            <button
                                type="button"
                                className="loadButton"
                                onClick={() => window.location.reload()}>
                                Refresh
                            </button>
                        </div>
                    ) : null}
                </>
            )
        }

        const typeOptions = Object.values(DataType);

        const handleSelect = () => {
            var dropdownList = document.getElementById("createSelect");
            console.log(dropdownList.options[dropdownList.selectedIndex].text);
            this.state.category = dropdownList.options[dropdownList.selectedIndex].text;
            //this.setState({category: dropdownList.options[dropdownList.selectedIndex].text});
            console.log(this.state.category)
        }

        return (
            <div className="modal">
                <div className="close" onClick={closeAndReset}>
                    &times;
                </div>
                <div className="header">Create Assets</div>
                <div className="content">
                    <div>
                        <label id="dropMenu">Select a data type:</label>
                        <select id="createSelect" onChange={handleSelect}>
                            {typeOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <form onSubmit={submit} style={formStyle}>
                        <input
                            type="text"
                            placeholder = "Asset Name:"
                            style={{ width: "33.34%", margin: "auto" }}
                            id="asset-name"
                        />
                        <input
                            type = "text"
                            placeholder="Asset Type:"
                            style={{width: "33.34%", margin: "auto"}}
                            id = "asset-type"
                        />
                        <input
                            type="text"
                            placeholder="Asset Short Type:"
                            style={{width: "33.34%", margin: "auto"}}
                            id="asset-short-type"
                        />
                        <input
                            type="text"
                            placeholder="Asset Connections:"
                            style={{width: "33.34%", margin: "auto"}}
                            id="asset-connection"
                        />
                        <input
                            type="submit"
                        />
                        {inputResult()}
                    </form>
                    {validateResult()}
                </div>
            </div>
        )
    }

    async pushAssets() {
        const state = this.state
        const category = state.category
        const asset = state.asset
        console.log(category)
        console.log(asset)
        //if (!category || !asset) return { error: "Invalid Asset" }
        return await ASSET.pushAssets(category.name, asset)
    }
}