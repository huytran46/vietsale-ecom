import React from "react";
import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

type Props = {
  items: any;
  itemPerPage: number;
  setCurrentItems: (next: any[]) => void;
};

const Pagination: React.FC<Props> = ({
  itemPerPage,
  items,
  setCurrentItems,
}) => {
  // We start with an empty list of items.
  const [pageCount, setPageCount] = React.useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = React.useState(0);

  React.useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemPerPage));
  }, [items, itemOffset, itemPerPage, setCurrentItems]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <ReactPaginate
      containerClassName={styles.Container}
      pageClassName={styles.Li}
      activeClassName={styles.Active}
      disabledClassName={styles.Disabled}
      breakLabel="..."
      nextLabel="Sau >"
      onPageChange={handlePageClick}
      pageRangeDisplayed={itemPerPage}
      pageCount={pageCount}
      previousLabel="< Trước"
      marginPagesDisplayed={pageCount}
    />
  );
};

export default Pagination;
