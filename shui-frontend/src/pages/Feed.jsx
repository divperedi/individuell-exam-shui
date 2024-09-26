import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

function Feed() {
    const [messages, setMessages] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const [updatedMessageText, setUpdatedMessageText] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [usernameFilter, setUsernameFilter] = useState('');

    useEffect(() => {
        fetch('https://fhyxm2r1fh.execute-api.eu-north-1.amazonaws.com/api/messages')
            .then(response => response.json())
            .then(data => {
                let filteredMessages = data.messages;
                if (usernameFilter) {
                    filteredMessages = filteredMessages.filter(message => message.username === usernameFilter);
                }
                const sortedMessages = filteredMessages.sort((a, b) => {
                    return sortOrder === 'desc'
                        ? new Date(b.createdAt) - new Date(a.createdAt)
                        : new Date(a.createdAt) - new Date(b.createdAt);
                });
                setMessages(sortedMessages);
            })
            .catch(error => console.error('Error:', error));
    }, [sortOrder, usernameFilter]);

    async function handleUpdate(username, id, updatedMessage) {
        try {
            const response = await fetch(
                `https://fhyxm2r1fh.execute-api.eu-north-1.amazonaws.com/api/messages/${username}/${id}`,
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        updatedMessage: updatedMessage
                    })
                }
            );
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                console.log('Update successful');
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(username, id) {
        try {
            const response = await fetch(
                `https://fhyxm2r1fh.execute-api.eu-north-1.amazonaws.com/api/messages/${username}/${id}`,
                {
                    method: "DELETE",
                }
            );
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                console.log('Delete successful');

                setMessages(messages => messages.filter(message => message.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const msgRef = useRef(null);

    useEffect(() => {
        if (editingMessage && msgRef.current) {
            msgRef.current.focus(); 
        }
    }, [editingMessage]);

    useEffect(() => {
        fetch('https://fhyxm2r1fh.execute-api.eu-north-1.amazonaws.com/api/messages')
            .then(response => {
                return response.json();
            })
            .then(data => {
                const sortedMessages = data.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setMessages(sortedMessages);
            })
            .catch(error => console.error('Error:', error));
    }, []);
    

    return (
        <>
            <section className='header-section'>
                <Header />
                <Link to="/new-post">
                    <img src={'/new-post.png'}
                        alt="new post icon"
                        className='new-post'
                    />
                </Link>
            </section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Filter by username"
                    value={usernameFilter}
                    onChange={e => setUsernameFilter(e.target.value)}
                    style={{ flex: '1', marginRight: '10px', padding: '5px' }}
                />
                <button
                    className='action-button'
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    style={{ padding: '5px 10px' }}
                >
                    Sort by date: {sortOrder === 'desc'}
                </button>
            </div>
            <section className='form'>
                {/* <h1 className='feed'>Feed</h1> */}
                {messages.length === 0 ? (
                    <div style={{ display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                height: '65vh' }}>
                    <p>There are no posts to display</p>
                </div>
            ) : (
                    messages.map((message, index) => (
                        <div className='post'>
                            <section className='top-post'>
                                <h3>{message.username}</h3>
                                <p>{message.createdAt}</p>
                            </section>
                            <p
                                className='msg'
                                contentEditable={editingMessage === message}
                                suppressContentEditableWarning={true}
                                onInput={(e) => setUpdatedMessageText(e.currentTarget.textContent)}
                                ref={editingMessage === message ? msgRef : null}
                            >
                                {message.message}
                            </p>
                            {editingMessage === message ? (
                                <div className='actions-buttons'>
                                    <button
                                        className='action-button'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleUpdate(message.username, message.id, updatedMessageText);
                                            setEditingMessage(null);
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className='action-button'
                                        onClick={() => setEditingMessage(null)}>
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <section className="actions-buttons">
                                    <button onClick={() => {
                                        setEditingMessage(message);
                                        setUpdatedMessageText(message.message);
                                    }} className='action-button'>EDIT</button>
                                    <button
                                        className='action-button action-button--danger'
                                        onClick={() => handleDelete(message.username, message.id)}
                                    >
                                        DELETE
                                    </button>
                                </section>
                            )}
                        </div>
                    ))
                )}
            </section>
        </>
    );
}

export default Feed;