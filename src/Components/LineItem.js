import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdCancel as DeleteIcon } from 'react-icons/md';
import './LineItem.scss';
import { TextField } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import axios from 'axios';

import { URL } from '../Constants/constants';

const LineItem = ({
  index,
  name,
  description,
  // quantity,
  price,
  totalCost,
  changeHandler,
  focusHandler,
  deleteHandler,
  currencyFormatter,
  materialUsages,
  setMaterialUsagesData,
}) => {
  const [nameValue, setNameValue] = useState(name);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [allMaterials, setAllMaterials] = useState([]);
  const [unitCost, setUnitCost] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [subtotal, setSubtotal] = useState(quantity * unitCost);

  const fetchMaterials = () => {
    axios.get(`${URL}materials`).then((response) => {
      setAllMaterials(response.data).catch((error) =>
        console.log('This is the error', error),
      );
    });
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    const material = allMaterials.find((material) => material.name === nameValue);
    if (material) {
      setSelectedMaterial(material);
      setUnitCost(material.unit_cost);
      setSubtotal(quantity * material.unit_cost);
      changeHandler(index)({
        target: {
          name: 'unitCost',
          value: material.unit_cost,
        },
      });
    }
  }, [nameValue, allMaterials]);

  const handleNameChange = (event) => {
    const material = allMaterials.find(
      (material) => material.name === event.target.value,
    );
    setSelectedMaterial(material);
    setNameValue(event.target.value);
    changeHandler(index)({
      target: {
        name: 'name',
        value: event.target.value,
      },
    });
  };

  const handleQuantityChange = (event) => {
    const newQuantity = event.target.value;
    setQuantity(newQuantity);
    setSubtotal(newQuantity * unitCost);

    const newMaterialUsage = { material: { id: selectedMaterial?.id }, quantity_used: newQuantity };
    setMaterialUsagesData(prevState => {
      const updatedState = [...prevState];
      updatedState[index] = newMaterialUsage;
      return updatedState;
    });
    
    changeHandler(index)({
      target: {
        name: 'quantity',
        value: newQuantity,
      },
    });
  };

  const handlePriceChange = (event) => {
    const newPrice = event.target.value;
    setUnitCost(newPrice);
    setSubtotal(quantity * newPrice);
    changeHandler(index)({
      target: {
        name: 'unitCost',
        value: newPrice,
      },
    });
  };


  return (
    <div className={"lineItem"}>
      <div>{index + 1}</div>
    
      <div>
        <Select
          name="name"
          value={nameValue}
          onChange={handleNameChange}
        >
          {allMaterials.length > 0 && allMaterials.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      {/* <div>
        <input
          name="description"
          type="text"
          value={description}
          onChange={changeHandler(index)}
        />
      </div> */}
      <div>
        <input
          name="quantity"
          type="number"
          step="1"
          value={quantity}
          onChange={handleQuantityChange}
          onFocus={focusHandler}
        />
      </div>
      <div className={'currency'}>
        <input
          name="unitCost"
          type="number"
          step="0.01"
          min="0.00"
          max="9999999.99"
          value={unitCost ? unitCost : ''}
          onChange={handlePriceChange}
          onFocus={focusHandler}
        />
      </div>
      {/* <div className={'currency'}>
        {currencyFormatter(quantity * price)}
      </div> */}
      <div className={'currency'}>
        {quantity * unitCost}
      </div>
      <div>
      <button
  type="button"
  className={'deleteItem'}
  onClick={() => deleteHandler(index)}

>
  <DeleteIcon size="1.25em" />
</button>

      </div>
    </div>
  );
};

// LineItem.propTypes = {
//   index: PropTypes.number.isRequired,
//   name: PropTypes.string,
//   description: PropTypes.string,
//   quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   changeHandler: PropTypes.func.isRequired,
//   focusHandler: PropTypes.func.isRequired,
//   deleteHandler: PropTypes.func.isRequired,
//   currencyFormatter: PropTypes.func.isRequired,
// };

export default LineItem;
