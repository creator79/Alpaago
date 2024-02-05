import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const User2 = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const activeUsers = fetchedUsers.filter(
        (user) => user.status === "active"
      );
      setUsers(activeUsers);

      setFilteredUsers(activeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await addDoc(collection(db, "users"), {
        username: "New User",
        addedDate: new Date(),
        status: "active",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Delete the document from Firestore
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);

      // Update the state to remove the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );

      console.log("User successfully deleted!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleChangeStatus = async (userId, status) => {
    // console.log("User ID:", userId); // Add this line to check the user ID
    try {
      const updateData = doc(db, "users", userId);
      const newStatus = status === "active" ? "inactive" : "active";

      await updateDoc(updateData, { status: newStatus });
      //   console.log("User status successfully updated!");

      // Update the status in the users and filteredUsers arrays
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error changing user status:", error);
    }
  };

  const handleSort = (columnName) => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[columnName] > b[columnName] ? 1 : -1;
      } else {
        return a[columnName] < b[columnName] ? 1 : -1;
      }
    });
    setFilteredUsers(sortedUsers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.addedDate.toDate().toLocaleDateString().includes(searchTerm) ||
        user.status.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filteredUsers);
  };

  const handleDateFilter = (e) => {
    const selectedDate = new Date(e.target.value);
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);

    // Set start date to beginning of selected day
    startDate.setHours(0, 0, 0, 0);

    // Set end date to end of selected day
    endDate.setDate(selectedDate.getDate() + 1); // Add one day
    endDate.setHours(0, 0, 0, 0); // Set time to beginning of next day

    const filteredUsers = users.filter(
      (user) =>
        user.addedDate.toDate() >= startDate &&
        user.addedDate.toDate() < endDate
    );
    setFilteredUsers(filteredUsers);
  };

  return (
    <div className="h-screen bg-slate-900 px-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-white font-bold text-3xl flex justify-center w-full mt-10">
          The User Table
        </h1>

        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <div className="relative">
            <div className="flex-1 text-centre justify-center mx-auto absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"></div>
            <input
              type="text"
              id="table-search-users"
              className="p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for users"
              onChange={handleFilter}
              value={searchTerm}
            />
          </div>
          <input
            type="date"
            onChange={handleDateFilter}
            className=" mr-10 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center"></div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:text-blue-700"
                onClick={() => handleSort("username")}
              >
                UserName
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:text-blue-700"
                onClick={() => handleSort("addedDate")}
              >
                Added Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:text-blue-700"
                onClick={() => handleSort("status")}
              >
                Status
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center"></div>
                </td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {user.username}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  {user.addedDate.toDate().toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center ">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        user.status === "active" ? "bg-green-500" : "bg-red-500"
                      } me-2`}
                    />
                    {user.status === "active" ? "Online" : "Offline"}
                  </div>
                </td>
                <td className="px-6 py-4 flex flex-row gap-8">
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete User
                  </button>
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline "
                    onClick={handleAddUser}
                  >
                    Add User
                  </button>

                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => handleChangeStatus(user.id, user.status)}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User2;
