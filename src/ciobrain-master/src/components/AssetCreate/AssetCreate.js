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
        this.state = { category: null, asset: null, result: null,
        tempAssetID: null, tempAssetName: null, tempAssetType: null, tempAssetShortType: null,
        tempConnectionApp: null, tempConnectionData: null, tempConnectionInfra: null }
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
            this.setState({ category: null, asset: null, result: null,
                            tempAssetID: null, tempAssetName: null, tempAssetType: null, tempAssetShortType: null,
                            tempConnectionApp: null, tempConnectionData: null, tempConnectionInfra: null })
        }

        const submit = event => {
            event.preventDefault()
            // const newAsset = {                                                                               //Template Asset for your pleasure
            //     "Application ID": 6,
            //     "Type": "core",
            //     "Short Type": "App",
            //     "Name": "Product maint2",
            //     "Infrastructure Connections": " ",
            //     "Data Connections": "D-1",
            //     "Type ": "web",
            //     "Owner": "Lynne Apple",
            //     "Vendor": "internal",
            //     "Language": "JAVA",
            //     "Software": "browser",
            //     "Business Function": "sales"
            // }
            var newAsset = {};
            var textboxName = document.getElementById("asset-name").value;
            var textboxType = document.getElementById("asset-type").value;
            var textboxShortType = document.getElementById("asset-short-type").value;
            var textboxConnection = document.getElementById("asset-connection").value;
            var assetID;
            console.log(textboxName +" "+ textboxType +" "+ textboxShortType +" "+ textboxConnection);
            
            //Begin creating asset
            ASSET.getAllAssetsForCategory(this.state.category).then(currAssets => {
                assetID = currAssets.length;                                                                  //returns length of assets in category
            
                if(this.state.category === "Application") {                                                          //This method sucks, since the tables have different values
                    newAsset = {
                        "Application ID": assetID,
                        "Type": textboxType,
                        "Short Type": textboxShortType,
                        "Name": textboxName,
                        "Data Connections": textboxConnection
                    }
                } else if(this.state.category === "Data") {
                    newAsset = {
                        "Data ID": assetID,
                        "Type": textboxType,
                        "Short Type": textboxShortType,
                        "Name": textboxName,
                        "Infrastructure Connections": " ",
                        "Data Connections": " ",
                        "Application Connections": " "
                    }
                } else if(this.state.category === "Infrastructure") {
                    newAsset = {
                        "Infrastructure ID": assetID,
                        "Type": textboxType,
                        "Short Type": textboxShortType,
                        "Name": textboxName,
                        "Application Connections": textboxConnection
                    }
                } else {
                    newAsset = {
                        "Project ID": assetID,
                        "Type": textboxType,
                        "Short Type": textboxShortType,
                        "Name": textboxName,
                        "Infrastructure Connections": " ",
                        "Data Connections": " ",
                        "Application Connections": " ",
                    }
                }

                this.setState({asset: newAsset}, () => {
                    //console.log(this.state.asset)
                });                                                                  //setState not working cuz is asynchronous. Needed to use = newAsset;
                //this.state.asset = newAsset;
                // console.log(this.state.asset)
                // console.log(newAsset)
                this.pushAssets().then(result => {
                    this.setState({ result: result })
                })
            })
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

        //UI Functions
        const typeOptions = Object.values(DataType);
        // const setDefaultSelect = () => {
        //     // this.setState({category: DataType.Application}, () => {
        //     //     console.log(this.state.category);
        //     // });
        //     // this.state.category = DataType.Application;
        //     // console.log(this.state.category);
        // }
        const handleSelect = () => {
            var dropdownList = document.getElementById("createSelect");
            // this.state.category = dropdownList.options[dropdownList.selectedIndex].text;
            this.setState({category: dropdownList.options[dropdownList.selectedIndex].text}, () => {
                console.log(this.state.category)
            });
        }

        //UI
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
                    </form>
                    {validateResult()}
                </div>
            </div>
        )
    }

    async pushAssets() {
        //this.state.category = DataType.Application;
        //this.setState({category: DataType.Application});
        const category = this.state.category
        const assets = [this.state.asset];
        console.log(category)
        console.log(assets)
        if (!category || !assets) return { error: "Invalid Asset" }
        return await ASSET.pushAssets(category, assets)
    }
}