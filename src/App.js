// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';

const InboxContent = () => {
  const [inboxData, setInboxData] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const fetchInboxData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/emails');
      const data = await response.json();
      setInboxData(data);
    } catch (error) {
      console.error('Error fetching inbox data:', error);
    }
  };

  useEffect(() => {
    fetchInboxData();
  }, []);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  return (
    <div className="flex-grow p-4">
      <h1 className="text-2xl font-semibold">Inbox</h1>
      <div className="flex">
        <div className="w-1/2">
          <div>
            {inboxData.map((email, index) => (
              <div
                key={index}
                className={`border-b py-2 cursor-pointer`}
                onClick={() => handleEmailClick(email)}>
                <div className="font-semibold">{email.sender}</div>
                <div className="text-gray-500">{email.subject}</div>
              </div>
            ))}
          </div>
        </div>
        {selectedEmail && (
          <div className="w-1/2 p-4">
            <h2 className="text-xl font-semibold mb-2">
              {selectedEmail.subject}
            </h2>
            <div className="text-gray-600 mb-4">{selectedEmail.sender}</div>
            <div>{selectedEmail.body}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const ComposeModal = ({ onClose }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postBodyData = JSON.stringify({
        recipient: to,
        subject,
        body,
      });

      const response = await fetch('http://localhost:3001/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:postBodyData,
      });
      const data = await response.json();
      console.log('data', data);
      onClose();
    } catch (error) {
      console.error('Error fetching inbox data:', error);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <h1 className="text-xl font-semibold mb-4">Compose Email</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">To:</label>
          <input
            type="text"
            className="w-full border rounded p-2 mb-4"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <label className="block mb-2">Subject:</label>
          <input
            type="text"
            className="w-full border rounded p-2 mb-4"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <label className="block mb-2">Body:</label>
          <textarea
            className="w-full border rounded p-2 mb-4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded">
            Send
          </button>
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            onClick={handleClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [showComposeModal, setShowComposeModal] = useState(false);

  return (
    <div className="flex h-screen">
      <div className="flex-shrink-0 w-64 bg-gray-200">
        <button
          className="py-2 px-4 bg-blue-500 text-white rounded m-4"
          onClick={() => setShowComposeModal(true)}>
          Compose
        </button>
      </div>
      <InboxContent />
      {showComposeModal && (
        <ComposeModal onClose={() => setShowComposeModal(false)} />
      )}
    </div>
  );
}

export default App;
