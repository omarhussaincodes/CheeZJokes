import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Joke from './Joke';

function Jokelist() {
    const jokeUrl = "https://icanhazdadjoke.com/";
    const numOfJokesToFetch = 8;
    const [jokes, setJokes] = useState(JSON.parse(window.localStorage.getItem("savedJokes") || "[]"));

    useEffect(() => {
        if (jokes.length === 0) {
            fetchJokes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchJokes = async () => {
        const allJokes = [];
        const header = {
            Accept: 'application/json'
        };
        while (allJokes.length < numOfJokesToFetch) {
            await axios.get(jokeUrl, {
                headers: header
            }).then(res => {
                if (res.status === 200) {
                    const filteredData = checkUniqueJoke(res.data);
                    if (filteredData.length === 0) {
                        allJokes.push({
                            jokeId: uuidv4(),
                            id: res.data?.id,
                            joke: res.data?.joke,
                            score: 0
                        });
                    }
                } else {
                    console.log("Failed to fetch a Joke!");
                }
            })
                .catch(e => console.log(e, "Failed to get jokes from API."));
        }
        // compare allJokes and Jokes and then add only jokes which are not present in jokes state.
        setJokes((prevJokes) => {
            if (prevJokes && prevJokes.length > 0) {
                return [...prevJokes, ...allJokes];
            } else {
                return allJokes;
            }
        });
        localStorage.setItem("savedJokes", JSON.stringify(jokes));
    };

    const fetchMoreJokes = () => {
        fetchJokes();
    }

    const checkUniqueJoke = (joke) => {
        return jokes.filter(j => j.id === joke.id);
    }

    const upVote = (id) => {
        setJokes(jokes.map(j => (j.id === id) ? { ...j, score: j.score + 1 } : j));
        sortBasedOfScore();
    };

    const downVote = (id) => {
        setJokes(jokes.map(j => (j.id === id) ? { ...j, score: j.score - 1 } : j));
        sortBasedOfScore();
    };

    const sortBasedOfScore = () => {
        setJokes((prevJokes) => [...prevJokes].sort((a, b) => (parseFloat(b.score) - parseFloat(a.score))));
        localStorage.setItem("savedJokes", JSON.stringify(jokes));
    };

    return (
        <div className='Joke-List'>
            <div>
                <button onClick={fetchMoreJokes}>More Jokes Please!</button>
            </div>
            <div>
                {jokes?.map(joke => (
                    <Joke key={joke.jokeId} id={joke.id} score={joke.score} joke={joke.joke} upVote={upVote} downVote={downVote} />
                ))}
            </div>

        </div>
    )
}

export default Jokelist