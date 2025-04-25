import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { FiPlus, FiSearch } from "react-icons/fi";
import Modal from "../../components/Modal/Modal";
import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Form state for new user
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://backend-78ls.onrender.com/users/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openNewUserModal = () => {
    setIsNewUserModalOpen(true);
  };

  const closeNewUserModal = () => {
    setIsNewUserModalOpen(false);
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newUsername.trim() || !newEmail.trim() || !newPassword.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (!newEmail.includes("@") || !newEmail.includes(".")) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        username: newUsername,
        email: newEmail,
        password: newPassword,
      });

      const response = await fetch("https://backend-78ls.onrender.com/users", {
        method: "POST",
        headers: myHeaders,
        body: raw,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! Status: ${response.status}`
        );
      }

      const newUser = await response.json();

      // Add the new user to the state
      setUsers([...users, newUser]);

      closeNewUserModal();

      // Show success message
      alert("User created successfully!");
    } catch (err) {
      setError(`Failed to create user: ${err.message}`);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setIsSearching(true);

      const response = await fetch(
        `https://backend-78ls.onrender.com/users/search/?username=${encodeURIComponent(
          searchQuery
        )}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(`Search error: ${err.message}`);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    fetchUsers();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="header-container">
          <h1>Users</h1>
          <button className="new-user-btn" onClick={openNewUserModal}>
            <FiPlus /> New User
          </button>
        </div>

        <div className="search-container">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search users by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <FiSearch />
              </button>
            </div>
          </form>

          {isSearching && (
            <div className="search-info">
              <p>Showing results for: "{searchQuery}"</p>
              <button className="clear-search-btn" onClick={clearSearch}>
                Clear search
              </button>
            </div>
          )}
        </div>

        {loading && <p>Loading users...</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-users">
                      {isSearching
                        ? "No users found matching your search"
                        : "No users found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* New User Modal */}
        <Modal
          isOpen={isNewUserModalOpen}
          onClose={closeNewUserModal}
          title="Create New Account"
        >
          <div className="user-form">
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <small className="password-hint">
                  Must be at least 6 characters
                </small>
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeNewUserModal}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Users;
