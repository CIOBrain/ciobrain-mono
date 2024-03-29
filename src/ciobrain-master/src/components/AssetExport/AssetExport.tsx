import { useState } from "react";
import Popup from "reactjs-popup"
import XLSX from "xlsx"
import * as ASSET from "../../common/Asset.js"
import DataTypeDropdown from "./DataTypeDropdown";
import { DataType } from "../../common/DataType";

const modalStyle = {
    maxWidth: "600px",
    width: "80%",
    borderRadius: "10px",
    border: "1px solid #D6D6D6",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)"
}


export default function AssetExport() {
    const [dataType, setType] = useState(DataType.Application);

    // Define a function that updates the type state
    function handleTypeChange(newType: DataType) {
        setType(newType);
    }

    async function handleClick() {
        // currently not using File web API
        /*const fileHandle = await window.showSaveFilePicker({
            suggestedName: "Data",
            types: [
                {
                    description: "Excel workbook",
                    accept: { "text/plain": [".xlsx"] },
                }
            ]
        });*/

        // create a workbook object with the data
        const workbook = XLSX.utils.book_new();

        const dataTypeName: string = dataType.toString().toLowerCase();

        // as any bad bad bad! make sure to have API and client use common types library
        const responseData = await ASSET.getAllAssetsForCategory(dataTypeName) as any;

        const worksheet = XLSX.utils.json_to_sheet(responseData)

        XLSX.utils.book_append_sheet(workbook, worksheet);

        // "download" file
        XLSX.writeFile(workbook, `${dataTypeName}.xlsx`, { bookType: "xlsx", type: "file" });

        // currently not using File web API
        //const writable = await fileHandle.createWritable();
        //await writable.write(f);
        //await writable.close();

        //<DataTypeDropdown onDataTypeChange={handleTypeChange} />
        //<button className="importButton" onClick={handleClick}>Export</button>
    }

    return (
        <Popup
            trigger={<button className="exportButton">Export</button>}
            modal={true}
            closeOnEscape={false}
            closeOnDocumentClick={true}
            contentStyle={modalStyle}>
                <DataTypeDropdown onDataTypeChange={handleTypeChange} />
                <div style={{display: "flex", justifyContent: "center"}}>
                    <button className="exportButtonSubmit" onClick={handleClick}>Submit</button>
                </div>
        </Popup>
    )
}