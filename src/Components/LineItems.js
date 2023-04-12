import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import LineItem from './LineItem';

import { MdAddCircle as AddIcon } from 'react-icons/md';
import './LineItems.scss';

const LineItems = ({items,   index,
  name,
  description,
  quantity,
  price,
  totalCost,
  changeHandler,
  focusHandler,
  deleteHandler,
  currencyFormatter,reorderHandler,addHandler,materialUsages}) => {
 
  const [lineItems, setLineItems] = useState(items);
  useEffect(() => {
    setLineItems(items);
  }, [items]);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    // helper function to reorder result (src: react-beautiful-dnd docs)
    const reorderedItems = Array.from(lineItems);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    // set new state representation
    setLineItems(reorderedItems);

    // call parent handler with new state representation
    reorderHandler(reorderedItems);
  };

  const handleAddClick = () => {
    addHandler();
  };

  return (
    <form>
      <div className={'lineItems'}>
        <div className={`${'gridTable'}`}>
          <div className={`${'row'} ${'header'}`}>
            <div>#</div>
            <div>Item</div>
            {/* <div>Description</div> */}
            <div>Qty</div>
            <div>Price</div>
            <div>Total</div>
            <div></div>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={snapshot.isDraggingOver ? 'listDraggingOver' : ''}
                >
                  {lineItems.map((item, i) => (
                    <Draggable key={item.id} draggableId={item.id} index={i}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          className={snapshot.isDragging ? 'listItemDragging' : ''}
                        >
                          <LineItem
                          index={i}
                          name={item.name}
                          description={item.description}
                          quantity={item.quantity}
                          price={item.price}
                          totalCost={item.quantity * item.price}
                          currencyFormatter={currencyFormatter}
                          changeHandler={changeHandler}
                          focusHandler={focusHandler}
                          deleteHandler={deleteHandler}
                          addHandler={addHandler}
                             
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className={'addItem'}>
          <button type="button" onClick={handleAddClick}>
            <AddIcon size="1.25em" className={'addIcon'} /> Add Item
          </button>
        </div>
      </div>
    </form>
  );
};

export default LineItems;

// LineItems.propTypes = {
//   items: PropTypes.array.isRequired,
//   currencyFormatter: PropTypes.func.isRequired,
//   addHandler: PropTypes.func.isRequired,
//   changeHandler: PropTypes.func.isRequired,
//   focusHandler: PropTypes.func.isRequired,
//   deleteHandler: PropTypes.func.isRequired,
//   reorderHandler: PropTypes.func.isRequired,
// };
