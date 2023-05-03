import { ChangeEvent, useState } from 'react';
import { DataType } from '../../common/DataType';

// Define an interface for the component state
interface DataTypeDropdownState {
  onDataTypeChange: (type: DataType) => void; // A callback function that takes a type as an argument
}

function DataTypeDropdown(props: DataTypeDropdownState) {
  const [dataType, setType] = useState(DataType.Application);

  // Define a method that handles the change event of the dropdown
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    // Get the selected value as a type
    const newType = event.target.value as DataType;
    // Update the state with the selected value
    setType(newType);
    // Call the prop function with the new type
    props.onDataTypeChange(newType);
  }

  // Get the enum values as an array
  const typeOptions = Object.values(DataType);
  // Return the JSX element for the dropdown
  return (
    <div style={{display: 'flex', justifyContent: "center"}}>
      <label style={{marginRight: 10}} htmlFor="type-dropdown">Select a data type:</label>
      <select id="type-dropdown" value={dataType} onChange={handleChange}>
        {/* Map each enum value to an option element */}
        {typeOptions.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
}

export default DataTypeDropdown;