import React from 'react';
import { FixedSizeList } from 'react-window';

const HEIGHT = 40;

/**
 * Uses react-window to optimize menu list in react-select in case it has a lot of options.
 */
const OptimizedMenuList = (props) => {
  const { options, children, maxHeight, getValue } = props;
  const selectedValues = getValue();
  const initialOffset =
    selectedValues && selectedValues[0] ? options.indexOf(selectedValues[0]) * HEIGHT : 0;

  return (
    <FixedSizeList
      height={maxHeight}
      itemCount={children['length']}
      itemSize={HEIGHT}
      initialScrollOffset={initialOffset}
      width={''} // 100% width
    >
      {({ index, style }) => (
        <div className="option-wrapper" style={style}>
          {children[index]}
        </div>
      )}
    </FixedSizeList>
  );
};

export default OptimizedMenuList;
