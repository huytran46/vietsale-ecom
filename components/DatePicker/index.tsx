import React from "react";
import DatePicker from "react-datepicker";
import style from "./DatePicker.module.css";

type P = {
  minDate?: Date;
  maxDate?: Date;
  onDateChange: (nextDate: Date) => void;
};

const MyDatePicker: React.FC<P> = ({ minDate, maxDate, onDateChange }) => {
  const [date, setStartDate] = React.useState<any>(new Date());

  React.useEffect(() => {
    onDateChange(date);
  }, [date]);

  return (
    <DatePicker
      className={style.DatePicker}
      minDate={minDate}
      maxDate={maxDate}
      selected={date}
      onChange={(date) => setStartDate(date ?? new Date())}
    />
  );
};

export default MyDatePicker;
