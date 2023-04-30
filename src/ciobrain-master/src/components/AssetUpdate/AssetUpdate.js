import React, { Component } from "react"
import Popup from "reactjs-popup"
//import { AssetCategoryEnum } from "../AssetCategoryEnum.js"
import "./AssetUpdate.css"
import "reactjs-popup/dist/index.css"
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

export default class AssetUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = { category: null, 
                    asset: null, 
                    result: null, 
                    selectedCategory: null,
                    selectedAssetKey: null }
    }

    render() {
        return (
            <Popup
                trigger={<button className="updateButton">Update</button>}
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
            this.setState({ category: null, 
                asset: null, 
                result: null, 
                selectedCategory: null,
                selectedAssetKey: null })
        }

        // const labelStyle = color => ({
        //     display: "flex",
        //     width: "33.33%",
        //     color: color,
        //     margin: "auto",
        //     fontSize: "20px",
        //     justifyContent: "center"
        // })

        const submit = async event => {
            event.preventDefault()
            //const url = document.getElementById('Azure-API-URL').value;
            //const password = document.getElementById('Azure-API-Password').value
            //const result = true;
            var textboxName = document.getElementById("asset-name").value;
            var textboxType = document.getElementById("asset-type").value;
            var textboxShortType = document.getElementById("asset-short-type").value;
            var textboxConnection = document.getElementById("asset-connection").value;
            
            this.getAssetById().then(asset => {
                this.setState({ asset: asset })
                console.log(asset)
            })
            const tempAsset = this.state.asset;
            console.log(tempAsset)
            if(textboxName !== ""){
                tempAsset[ 'Name' ] = textboxName;
            }
            if(textboxType !== ""){
                tempAsset[ 'Type' ] = textboxType;
            }
            if(textboxShortType !== ""){
                tempAsset[ 'Short Type' ] = textboxShortType;
            }
            if(textboxConnection !== ""){
                tempAsset[ 'Data Connections' ] = textboxConnection;
            }

            this.setState({asset: tempAsset}, () => {
                console.log(this.state.asset)
            });

            this.pushAssets().then(result => {
                this.setState({ result: result })
            })
            
            //this.setState({ result: result })
        }
        
        const validateResult = () => {
            const result = this.state.result
            //console.log(result)
            //console.log("result")
            if (!result) return null
            const error = result["error"]
            if (error)
                return (
                    <div className="updateDetails" style={{ color: "red" }}>
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

        return (
            <div className="modal">
                <div className="close" onClick={closeAndReset}>
                    &times;
                </div>
                <div className="header">Update Assets</div>
                <div className="content">
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
    async getAssetById(){
        const category = this.state.selectedCategory
        const assetid = this.state.selectedAssetKey
        console.log(category)
        console.log(assetid)
        if (!category || !assetid) return { error: "Invalid Asset" }
        return await ASSET.getAssetById(category, assetid)
    }
    async pushAssets() {
        const state = this.state
        const category = state.category
        const asset = state.asset
        console.log(category)
        console.log(asset)
        if (!category || !asset) return { error: "Invalid Asset" }
        return await ASSET.pushAssets(category, asset)
    }
    async componentWillReceiveProps(nextProps) {
        if (
            this.state.selectedCategory === nextProps.selectedCategory &&
            this.state.selectedAssetKey === nextProps.selectedAssetKey
        )
            return
        this.setState({
            selectedCategory: nextProps.selectedCategory,
            selectedAssetKey: nextProps.selectedAssetKey
        })
    }
}