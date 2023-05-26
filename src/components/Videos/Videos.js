import React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import './videos.css'

function Videos({ videos }) {

    const [results, setResults] = useState({})
    useEffect(() => {
        setResults({ ...videos })
    }, [videos])

    return (
        <div className='container'>
            {
                Object.keys(results).length === 0 && (
                    <div className="alert alert-primary" role="alert">
                        No Search Results Yet!, Please submit a search above!
                    </div>
                )
            }
            {
                results.hasOwnProperty('response') && (
                    <div className='row'>
                        {results['response'].map((item, i) => {
                            return <div className="col-lg-6 mb-4" key={i}>
                                <div className="card">
                                    <img src={item['snippet']['thumbnails']['medium']['url']} className="card-img-top" alt={item['etag']} />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            <NavLink
                                                to={`/videos/${item['id']['videoId']}`}
                                                className={''}
                                            >{item['snippet']['title']}</NavLink>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                )
            }
        </div>
    )
}

export default Videos