import React, { useState, useEffect, useRef } from "react";
import { Dropdown, ListGroup } from "react-bootstrap";
import { FixedSizeList as List } from "react-window";

const TimePickerAnswer = () => {
  const [selectedTime, setSelectedTime] = useState("00:00");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const buttonRef = useRef();

  const generateTimeOptions = () => {
    const timeOptions = [];
    for (let hour = 0; hour < 10000; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        timeOptions.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return timeOptions;
  };

  const timeOptions = generateTimeOptions();

  const handleClick = (index) => {
    const timeValue = timeOptions[index];
    setSelectedTime(timeValue);
    setShowDropdown(false);
  };

  const Row = ({ index, style }) => (
    <ListGroup.Item action style={style} onClick={() => handleClick(index)}>
      {timeOptions[index]}
    </ListGroup.Item>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <Dropdown
        show={showDropdown}
        onToggle={() => setShowDropdown(!showDropdown)}
      >
        <Dropdown.Toggle variant="success" ref={buttonRef}>
          {selectedTime}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ overflowY: "hidden" }}>
          <List
            height={150}
            itemCount={timeOptions.length}
            itemSize={35}
            width={200}
          >
            {Row}
          </List>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default TimePickerAnswer;
