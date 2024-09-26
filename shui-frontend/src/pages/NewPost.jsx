import { useState } from 'react';
import walkingRuby from '../assets/walking-ruby.gif';
import Header from '../components/Header';

function NewPost() {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [postSuccess, setPostSuccess] = useState(false);
    const [postError, setPostError] = useState(false);

    async function handleUpload(event) {
        event.preventDefault();

        if (!message || !username) {
            setPostError(true);
            setTimeout(() => {
                setPostError(false);
            }, 3000);
            return;
        }

        try {
            const response = await fetch(
                "https://fhyxm2r1fh.execute-api.eu-north-1.amazonaws.com/api/messages",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        username: username
                    })
                }
            );
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setMessage("");
                setUsername("");
                setPostSuccess(true);

                setTimeout(() => {
                    setPostSuccess(false);
                }, 3000);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Header />
            {postSuccess && <p className='pop-up-success'>Post shared successfully!</p>}
            {postError && <p className='pop-up-error'>Please fill in all fields!</p>}
            <form onSubmit={handleUpload}>
                <textarea
                    placeholder="Enter your message"
                    className='text-area'
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                />
                <section className='footer'>
                    <input
                        type="text"
                        placeholder='Username'
                        className='username-area'
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                    />
                    <button type="submit">SHARE</button>
                </section>
            </form>
            <img src={walkingRuby} alt="Walking Cat" className="walking-cat" />
        </div>
    )
}

export default NewPost;