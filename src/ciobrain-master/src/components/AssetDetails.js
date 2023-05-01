import React, { Component } from "react"
import { AssetCategoryEnum } from "./AssetCategoryEnum"
//import * as ERRORLOG from "./../common/ErrorLog"
import { getAssetById } from "../common/Asset.js"
import AssetUpdate from "./AssetUpdate/AssetUpdate"
import AssetDelete from "./AssetDelete/AssetDelete"

export default class AssetDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCategory: null,
            selectedAssetKey: null,
            asset: null,
            assetColor: null,
            assetConnections: null,
            assetInfo: []
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (
            this.state.selectedCategory === nextProps.selectedCategory &&
            this.state.selectedAssetKey === nextProps.selectedAssetKey &&
            this.state.assetInfo === nextProps.assetInfo
        )
            return
        this.setState({
            selectedCategory: nextProps.selectedCategory,
            selectedAssetKey: nextProps.selectedAssetKey,
            assetInfo: nextProps.assetInfo
        })
        await this.getAssetDetails(
            nextProps.selectedAssetKey,
            nextProps.selectedCategory,
            nextProps.assetInfo
        )
    }

    async getAssetDetails(selectedAssetKey, selectedCategory) {
        const asset = await getAssetById(selectedCategory, selectedAssetKey)
        const assetConnections = this.countAssetConnections(asset)
        const assetColor =
            AssetCategoryEnum[asset["Asset Type"].toUpperCase()].color
        this.setState({
            asset: asset,
            assetColor: assetColor,
            assetConnections: assetConnections
        })
        await this.validateAsset(asset)
    }

    async validateAsset(asset) {
        const type =
            asset["Asset Type"] === "Infrastructure" ? "Long Type" : "Type"
        const requiredDetails = [type, "Owner", "Vendor", "Language"]
        const missingDetails = requiredDetails.filter(
            column => !asset[column] || asset[column].trim().length === 0
        )
        if (missingDetails.length === 0) return
        // await ERRORLOG.log(
        //     missingDetails.join(", ") +
        //         ' details missing for asset "' +
        //         asset["Name"] +
        //         '"',
        //     JSON.stringify(asset)
        // )
    }

    countAssetConnections(asset) {
        return Object.values(AssetCategoryEnum)
            .map(category => {
                const connections = asset[category.name + " Connections"]
                return connections && connections.trim().length
                    ? connections.split(";").length
                    : 0
            })
            .reduce((a, b) => a + b, 0)
    }

    displayAssetInfo(asset) {
        return <div id="assetDetail" className="card">
            <input type="checkbox" id="expandDetails"/>
            <div id="assetDetailHeader">
                <label className="detailsLabel" htmlFor="expandDetails">Details</label>
            </div>
            <div className="detailsContent">
                <div id="assetName" style={{ color: this.state.assetColor }}>
                    {asset["Name"]}
                </div>
                <div id="assetDetailSections">
                    <div id="asset_connections">
                        Connections: {asset["Connections"]}
                    </div>
                    <div>
                        Type:{" "}
                        {asset["Asset Type"] === "Infrastructure"
                            ? asset["Long Type"]
                            : asset["Type"]}
                    </div>
                    <div>Owner: {asset["Owner"]}</div>
                    <div>Vendor: {asset["Vendor"]}</div>
                    <div>Language: {asset["Language"]}</div>
                    <div>Software: {asset["Software"]}</div>
                    <div>Business Function: {asset["Business Function"]}</div>
                    <div>Comment: {asset["Comment"]}</div>
                </div>
            </div>
            <div id="assetMenuHeader">
                <div>Modify</div>
                <AssetUpdate />
                <AssetDelete />
            </div>
        </div>
    }

    render() {
        const asset = this.state.assetInfo
        return asset ? (this.displayAssetInfo(asset)) : null
    }
}
