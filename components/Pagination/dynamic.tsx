import React from "react";
import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

type Props = {
  pageNo: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (nextPageNo: number) => void;
};

const Pagination: React.FC<Props> = ({
  pageNo,
  pageSize,
  totalPages,
  onPageChange,
}) => {
  // We start with an empty list of items.
  const [pageCount] = React.useState(totalPages);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1);
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
      pageRangeDisplayed={pageSize}
      pageCount={pageCount}
      previousLabel="< Trước"
      marginPagesDisplayed={pageCount}
    />
  );
};

export default Pagination;
