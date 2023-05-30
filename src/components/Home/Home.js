import React, { useEffect } from 'react'
import { useState } from 'react'
import Videos from '../Videos/Videos'
import { useParams } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa';

function Home() {

    const { home } = useParams()

    const [search, setSearch] = useState('')
    const [safeSearch, setsafeSearch] = useState('moderate');
    const [videos, setVideos] = useState({})
    const [modal, setModal] = useState(true)
    const [error, setError] = useState(false)
    // eslint-disable-next-line
    useEffect(() => {
        if (localStorage.getItem('response') !== null) {
            let searchstring = (JSON.parse(localStorage.getItem('response'))[1]).toString()
            let npage = JSON.parse(localStorage.getItem('response'))[0]['nextPageToken']
            if (home === 'home') {
                setVideos({
                    response: JSON.parse(localStorage.getItem('response'))[0]['items'], nextPageToken: JSON.parse(localStorage.getItem('response'))[0]['nextPageToken'],

                    page: (JSON.parse(localStorage.getItem('response'))[0]).hasOwnProperty('prevPageToken') ? true : false
                })
            }
            else if (home === npage) {
                getVideoData(searchstring, npage)
            }
            else if (home === 'page1') {
                getVideoData(searchstring)
            }
        }
    }, [home])

    async function getVideoData(args, argsN) {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search ? search.trim() : args}&safeSearch=${safeSearch}&key=${process.env.REACT_APP_API_KEY}&pageToken=${argsN || ''}`
                //`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search ? search.trim() : args}&safeSearch=${safeSearch}&key=${process.env.REACT_APP_API_KEY2}&pageToken=${argsN || ''}`
            );

            if (!response.ok) {
                setModal(false);
                setError(true)
                setSearch('')
            }

            const data = await response.json();
            if (data.items.length === 0) setVideos({})
            else setVideos({ response: data.items, nextPageToken: data.nextPageToken, page: data.hasOwnProperty('prevPageToken') ? true : false }); localStorage.setItem('response', JSON.stringify([data, search ? search.trim() : args])); setModal(true);
        } catch (error) {
            console.error('Error searching videos:', error);
            setModal(false);
            setError(true)
            setSearch('')
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (search === '') return
        getVideoData()
        setSearch('')
    }

    const handleSafeSearch = (e) => {
        setsafeSearch(e.target.value);
    };

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
                        <div className='input-group py-1'>
                            <select
                                className="form-control"
                                value={safeSearch}
                                onChange={handleSafeSearch}
                            >
                                <option value="moderate">safeSearch</option>
                                <option value="none">None</option>
                                <option value="strict">Strict</option>
                            </select>
                        </div>
                        <button className="btn btn-primary mt-1" type="submit">Search</button>
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
                                    <button type="button" className="close" onClick={closeModal}>
                                        <FaTimes />
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