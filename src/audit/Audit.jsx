import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";

import { userActions } from "_store";

export function Audit() {
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY hh:mm:ss");
  const [filterText, setFilterText] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const users = useSelector((state) => state.users.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  const handleDateFormatChange = (e) => {
    setDateFormat(e.target.value);
  };

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSort = (column, sortDirection) => {
    setSortField(column.selector);
    setSortDirection(sortDirection);
  };

  const columns = [
    {
      name: "First Name",
      selector: "firstName",
      sortable: true,
    },
    {
      name: "Last Name",
      selector: "lastName",
      sortable: true,
    },
    {
      name: "Username",
      selector: "username",
      sortable: true,
    },
  ];

  const filteredUsers = users?.value?.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.username}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const sortedUsers = sortField
    ? [...filteredUsers].sort((a, b) => {
        const fieldA = a[sortField]?.toLowerCase();
        const fieldB = b[sortField]?.toLowerCase();
        if (fieldA < fieldB) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      })
    : filteredUsers;

  const formattedUsers = sortedUsers?.map((user) => {
    return {
      ...user,
      createdAt: new Date(user.createdAt).toLocaleString("en-US", {
        hour12: !dateFormat.includes("HH"),
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    };
  });

  return (
    <div>
      <h1>Auditor Page</h1>
      <br />
      <div>
        <label htmlFor="dateFormat">Date/Time Format : </label>
        <select
          id="dateFormat"
          value={dateFormat}
          onChange={handleDateFormatChange}
        >
          <option value="DD/MM/YYYY hh:mm:ss">
            12 Hour (DD/MM/YYYY hh:mm:ss)
          </option>
          <option value="DD/MM/YYYY HH:mm:ss">
            24 Hour (DD/MM/YYYY HH:mm:ss)
          </option>
        </select>
        <br />
        <br />
        <label htmlFor="filterText">Common Filter : </label>
        <input
          type="text"
          id="filterText"
          value={filterText}
          onChange={handleFilterTextChange}
        />
      </div>
      <br />
      <br />
      <DataTable
        columns={columns}
        data={formattedUsers}
        pagination
        highlightOnHover
        striped
        progressPending={users?.loading}
        noDataComponent="No users found"
        paginationComponentOptions={{
          rowsPerPageText: "Rows per page:",
          rangeSeparatorText: "of",
        }}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />
    </div>
  );
}
