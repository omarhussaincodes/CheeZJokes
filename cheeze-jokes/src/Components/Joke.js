import React from 'react'

function Joke({ joke, score, id, upVote, downVote }) {
    function handleUpVote() {
        upVote(id);
    }

    function handleDownVote() {
        downVote(id);
    }

    return (
        <div style={{ display: "flex" }}>
            <button onClick={handleUpVote}>UpVote</button>
            <span>{score || 0}</span>
            <button onClick={handleDownVote}>DownVote</button>
            <span>{joke}</span>
        </div>
    )
}

export default Joke