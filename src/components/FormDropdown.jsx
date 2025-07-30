import React, { useEffect, useRef, useState } from "react";

const FormDropdown = (props) => {
  const {
    dataList,
    onAdd,
    onUpdate,
    onChange,
    onEdit,
    value,
    placeholder = "Select...",
  } = props;

  const [search, setSearch] = useState("");
  const [showDataList, setShowDataList] = useState(false);
  const [editingOption, setEditingOption] = useState(null); // null or option being edited

  const containerRef = useRef(null);

  useEffect(() => {
    if (!showDataList) return;

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDataList(false);
        setSearch("");
        setEditingOption(null); // exit edit mode on outside click
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDataList]);

  const selectedOption = dataList.find((opt) => opt.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : "";

  const filteredDataList = dataList.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Check if typed search exactly matches any label (ignore case)
  const isExactMatch = dataList.some(
    (opt) => opt.label.toLowerCase() === search.toLowerCase()
  );

  const handleSelect = (option) => {
    onChange?.(option.value);
    setShowDataList(false);
    setSearch("");
    setEditingOption(null);
  };

  // Add new option
  const handleAdd = () => {
    if (search.trim() === "") return;
    if (isExactMatch) return;

    const newLabel = search.trim();
    const newValue = newLabel
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    onAdd?.({ label: newLabel, value: newValue });
    onChange?.(newValue);
    setSearch("");
    setShowDataList(false);
    setEditingOption(null);
  };

  // Start editing an existing option
  const handleEditClick = (option) => {
    onEdit?.(option);
    setSearch(option.label);
    setShowDataList(true);
    setEditingOption(option);
  };

  // Update an existing option after editing
  const handleUpdate = () => {
    if (!editingOption) return;
    if (search.trim() === "") return;

    const updatedLabel = search.trim();
    const updatedValue = updatedLabel
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    // Prevent duplicate value for other options
    const duplicate = dataList.find(
      (opt) => opt.value === updatedValue && opt.value !== editingOption.value
    );
    if (duplicate) {
      alert("This value already exists.");
      return;
    }

    onUpdate?.({
      oldValue: editingOption.value,
      updated: { label: updatedLabel, value: updatedValue },
    });
    onChange?.(updatedValue);
    setSearch("");
    setShowDataList(false);
    setEditingOption(null);
  };

  // Decide which button to show: Add or Update
  // Show Update if editingOption not null, else Add if no exact match and text entered
  const showAddButton =
    onAdd &&
    !editingOption &&
    search.trim() &&
    filteredDataList.length === 0 &&
    !isExactMatch;

  const showUpdateButton = onUpdate && editingOption && search.trim();

  const displayValue = showDataList ? search : selectedLabel;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center">
        <input
          autoComplete="off"
          type="text"
          value={displayValue}
          placeholder={placeholder}
          onFocus={() => setShowDataList(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDataList(true);
          }}
          className="flex-1 pr-20 py-2 pl-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showAddButton && (
          <button
            type="button"
            className="absolute right-1 top-1 h-7 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm cursor-pointer"
            onClick={handleAdd}
          >
            Add
          </button>
        )}

        {showUpdateButton && (
          <button
            type="button"
            className="absolute right-1 top-1 h-7 px-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm cursor-pointer"
            onClick={handleUpdate}
          >
            Update
          </button>
        )}
      </div>

      {showDataList && filteredDataList.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow max-h-40 overflow-y-auto text-left">
          {filteredDataList.map((opt) => (
            <li
              key={opt.value}
              role="option"
              tabIndex={0}
              className={`flex justify-between items-center px-3 py-2 cursor-pointer ${
                value === opt.value ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <span
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelect(opt);
                  }
                }}
                tabIndex={-1}
                className="flex-grow"
              >
                {opt.label}
              </span>
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(opt);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-600 rounded"
                >
                  Edit
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormDropdown;
