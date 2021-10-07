import React from "react";
import { FixedSizeGrid as Grid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";

type CellRender = (param: {
  columnIndex: number;
  rowIndex: number;
  style: any;
}) => JSX.Element;

type Props = {
  isItemLoaded: (index: number) => boolean;
  itemCount: number;
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
  onCellRender: CellRender;
  rowHeight: number;
  columnCount: number;
  columnWidth: number;
};

const VirtualizedGrid: React.FC<Props> = ({
  isItemLoaded,
  itemCount,
  loadMoreItems,
  onCellRender,
}) => {
  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ ref }) => (
        <AutoSizer defaultHeight={500} defaultWidth={500}>
          {({ width, height }) => (
            <Grid
              width={width}
              height={500}
              columnCount={1000}
              columnWidth={100}
              rowCount={itemCount}
              rowHeight={35}
              ref={ref}
            >
              {onCellRender}
            </Grid>
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
};

// const VirtualizedGrid: React.FC<Props> = ({
//   itemCount,
//   itemSize,
//   onRowRender,
//   data,
// }) => {
//   return (
//     <AutoSizer>
//       {({ height, width }) => {
//         console.log("height:", height);
//         console.log("width:", width);
//         return (
//           <FixedSizeList
//             itemData={data}
//             width={width}
//             height={height}
//             itemCount={itemCount}
//             itemSize={itemSize}
//           >
//             {onRowRender}
//           </FixedSizeList>
//         );
//       }}
//     </AutoSizer>
//   );
// };

export default VirtualizedGrid;
