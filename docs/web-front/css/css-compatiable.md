# CSS兼容性
CSS的属性兼容性可以在Can I Use里查看。本文将介绍一些在开发Hybrid APP时，应注意的地方。尤其是需要兼容Android 5.0时，有些属性将不能使用。

- display:grid
这个属性不兼容Android 5.0，可以自己写一个GridLayout实现网格布局的效果。代码:
```javascript

import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const LineContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  ${props =>
    props.gridRowGap &&
    css`
      margin-bottom: ${props.gridRowGap}px;
    `}
`;

const ItemContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: none;
  ${props =>
    props.gridColumnGap &&
    css`
      margin-right: ${props.gridColumnGap}px;
    `}
`;

/**
 * 网格布局
 * @param {} param0
 */
const GridLayout = ({
  gridRowGap,
  gridColumnGap,
  columns,
  datalist,
  renderItem,
}) => {
  if (!datalist || datalist.length === 0 || columns === 0) {
    return <Container></Container>;
  }
  datalist = datalist.slice(0, datalist.length - 2);
  const _length = datalist.length;
  var domListOfEachLine = [];
  var gridLines = [];

  for (var i = 0; i < _length; i++) {
    const isLastRow = _length - i > _length % columns ? false : true;
    const isLastColumn = i % columns < columns - 1 ? false : true;

    if (i % columns === columns - 1) {
      //要换行了
      gridLines.push(
        <ItemContainer gridColumnGap={isLastColumn ? 0 : gridColumnGap}>
          {renderItem(datalist[i], i)}
        </ItemContainer>
      );
      domListOfEachLine.push(
        <LineContainer key={i} gridRowGap={isLastRow ? 0 : gridRowGap}>
          {gridLines}
        </LineContainer>
      );
      gridLines = [];
    } else {
      gridLines.push(
        <ItemContainer gridColumnGap={isLastColumn ? 0 : gridColumnGap}>
          {renderItem(datalist[i], i)}
        </ItemContainer>
      );
    }
  }
  if (gridLines.length !== 0) {
    //说明最后一行没填满, 自动填满空的div
    const blank_count = columns - gridLines.length;
    for (var i = 0; i < blank_count; i++) {
      gridLines.push(
        <ItemContainer
          gridColumnGap={i === blank_count - 1 ? 0 : gridColumnGap}
        ></ItemContainer>
      );
    }
    domListOfEachLine.push(
      <LineContainer key={'last'}>{gridLines}</LineContainer>
    );
  }
  return <Container>{domListOfEachLine}</Container>;
};

GridLayout.propType = {
  columns: PropTypes.number,
  datalist: PropTypes.array,
  renderItem: PropTypes.func,
  gridColumnGap: PropTypes.number,
  gridRowGap: PropTypes.number,
};

export default GridLayout;

```
