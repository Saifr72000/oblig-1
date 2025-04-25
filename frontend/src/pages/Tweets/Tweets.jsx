import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { FiTrash2, FiEdit2, FiPlus, FiSearch } from "react-icons/fi";
import Modal from "../../components/Modal/Modal";
import "./tweets.css";

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTweetModalOpen, setIsNewTweetModalOpen] = useState(false);
  const [currentTweet, setCurrentTweet] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [newTweetContent, setNewTweetContent] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [contentSearchQuery, setContentSearchQuery] = useState("");
  const [hashtagSearchQuery, setHashtagSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState("");

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://backend-78ls.onrender.com/tweets/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTweets(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://backend-78ls.onrender.com/users/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchTweets();
    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tweet?")) {
      try {
        const response = await fetch(
          `https://backend-78ls.onrender.com/tweets/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Remove the deleted tweet from state
        setTweets(tweets.filter((tweet) => tweet.id !== id));
      } catch (err) {
        setError(`Failed to delete tweet: ${err.message}`);
      }
    }
  };

  const openEditModal = (tweet) => {
    setCurrentTweet(tweet);
    setEditContent(tweet.content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTweet(null);
    setEditContent("");
  };

  const openNewTweetModal = () => {
    setIsNewTweetModalOpen(true);
    // Set default selected user if available
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id.toString());
    }
  };

  const closeNewTweetModal = () => {
    setIsNewTweetModalOpen(false);
    setNewTweetContent("");
    setSelectedUserId("");
  };

  const handleEdit = async () => {
    if (!currentTweet || !editContent.trim()) return;

    try {
      const response = await fetch(
        `https://backend-78ls.onrender.com/tweets/${
          currentTweet.id
        }?content=${encodeURIComponent(editContent)}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedTweet = await response.json();

      // Update the tweet in the state
      setTweets(
        tweets.map((tweet) =>
          tweet.id === currentTweet.id ? updatedTweet : tweet
        )
      );

      closeModal();
    } catch (err) {
      setError(`Failed to update tweet: ${err.message}`);
    }
  };

  const handleCreateTweet = async () => {
    if (!newTweetContent.trim() || !selectedUserId) {
      alert("Please enter tweet content and select a user");
      return;
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        content: newTweetContent,
      });

      const response = await fetch(
        `https://backend-78ls.onrender.com/tweets/?user_id=${selectedUserId}`,
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newTweet = await response.json();

      // Add the new tweet to the state
      setTweets([...tweets, newTweet]);

      closeNewTweetModal();

      // Show success message
      alert("Tweet created successfully!");
    } catch (err) {
      setError(`Failed to create tweet: ${err.message}`);
    }
  };

  const handleContentSearch = async (e) => {
    e.preventDefault();
    if (!contentSearchQuery.trim()) return;

    try {
      setLoading(true);
      setIsSearching(true);
      setSearchType("content");

      const response = await fetch(
        `https://backend-78ls.onrender.com/tweets/search/?query=${encodeURIComponent(
          contentSearchQuery
        )}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTweets(data);
      setLoading(false);
    } catch (err) {
      setError(`Search error: ${err.message}`);
      setLoading(false);
    }
  };

  const handleHashtagSearch = async (e) => {
    e.preventDefault();
    if (!hashtagSearchQuery.trim()) return;

    // Remove # if user included it
    const hashtag = hashtagSearchQuery.trim().replace(/^#/, "");

    try {
      setLoading(true);
      setIsSearching(true);
      setSearchType("hashtag");

      const response = await fetch(
        `https://backend-78ls.onrender.com/tweets/hashtags/?hashtag=${encodeURIComponent(
          hashtag
        )}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTweets(data);
      setLoading(false);
    } catch (err) {
      setError(`Search error: ${err.message}`);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setContentSearchQuery("");
    setHashtagSearchQuery("");
    setIsSearching(false);
    setSearchType("");
    fetchTweets();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="header-container">
          <h1>Tweets</h1>
          <button className="new-tweet-btn" onClick={openNewTweetModal}>
            <FiPlus /> New Tweet
          </button>
        </div>

        <div className="search-container">
          <div className="search-row">
            <form className="search-form" onSubmit={handleContentSearch}>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search tweets..."
                  value={contentSearchQuery}
                  onChange={(e) => setContentSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <FiSearch />
                </button>
              </div>
            </form>

            <form className="search-form" onSubmit={handleHashtagSearch}>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search by hashtag..."
                  value={hashtagSearchQuery}
                  onChange={(e) => setHashtagSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <FiSearch />
                </button>
              </div>
            </form>
          </div>

          {isSearching && (
            <div className="search-info">
              <p>
                {searchType === "content"
                  ? `Showing results for: "${contentSearchQuery}"`
                  : `Showing results for hashtag: #${hashtagSearchQuery.replace(
                      /^#/,
                      ""
                    )}`}
              </p>
              <button className="clear-search-btn" onClick={clearSearch}>
                Clear search
              </button>
            </div>
          )}
        </div>

        {loading && <p>Loading tweets...</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && (
          <div className="table-container">
            <table className="tweets-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Content</th>
                  <th>Timestamp</th>
                  <th>Author ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tweets.length > 0 ? (
                  tweets.map((tweet) => (
                    <tr key={tweet.id}>
                      <td>{tweet.id}</td>
                      <td>{tweet.content}</td>
                      <td>{formatDate(tweet.timestamp)}</td>
                      <td>{tweet.author_id}</td>
                      <td className="actions-cell">
                        <button
                          className="edit-btn"
                          onClick={() => openEditModal(tweet)}
                          aria-label="Edit tweet"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(tweet.id)}
                          aria-label="Delete tweet"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-tweets">
                      {isSearching
                        ? "No tweets found matching your search"
                        : "No tweets found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Tweet Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Tweet">
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="tweetContent">Tweet Content:</label>
              <textarea
                id="tweetContent"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                placeholder="Enter new tweet content"
              />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </Modal>

        {/* New Tweet Modal */}
        <Modal
          isOpen={isNewTweetModalOpen}
          onClose={closeNewTweetModal}
          title="Create New Tweet"
        >
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="newTweetContent">Tweet Content:</label>
              <textarea
                id="newTweetContent"
                value={newTweetContent}
                onChange={(e) => setNewTweetContent(e.target.value)}
                rows={4}
                placeholder="What's happening?"
              />
            </div>
            <div className="form-group">
              <label htmlFor="userSelect">Select User:</label>
              <select
                id="userSelect"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="user-select"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} (ID: {user.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeNewTweetModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleCreateTweet}>
                Tweet
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Tweets;
