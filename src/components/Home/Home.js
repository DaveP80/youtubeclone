import React, { useEffect } from 'react'
import { useState } from 'react'
import Videos from '../Videos/Videos'
import { useParams } from 'react-router-dom'

function Home() {

    const { home } = useParams()

    const [search, setSearch] = useState('')
    const [videos, setVideos] = useState({})
    const [newS, setNewS] = useState(home)
    const [modal, setModal] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (newS === 'home') {
            if (localStorage.getItem('response') !== null) {
                setVideos({ response: JSON.parse(localStorage.getItem('response')) })
            }
        };
    }, [newS])

    async function handleSubmit(e) {
        e.preventDefault()
        if (search === '') return
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search.trim()}&key=${process.env.REACT_APP_API_KEY}`
                // `https://www.googleapis.com/youtube/v3/search?part=snpet&q=${search.trim()}&key=${process.env.REACT_APP_API_KEY}`
            );

            if (!response.ok) {
                setModal(false);
                setError(true)
                setSearch('')
                return
            }

            const data = await response.json();
            if (data.items.length === 0) setVideos({})
            else setVideos({ response: data.items }); localStorage.setItem('response', JSON.stringify(data.items)); setModal(true);
        } catch (error) {
            console.error('Error searching videos:', error);
            setVideos({})
        }
        setSearch('')
    }

    const closeModal = () => {
        setError(false);
        setModal(true)
    };

    return (
        <>
            <div className="container mt-2">
                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" id='searchbar' value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search videos" />
                        <button className="btn btn-primary" type="submit">Search</button>
                    </div>
                </form>
            </div>
            {
                modal && <Videos videos={videos} />
            }
            {
                error && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Error</h5>
                                </div>
                                <div className="modal-body">
                                    <p>Search Api is Down</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={closeModal}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </>
    )
}

export default Home