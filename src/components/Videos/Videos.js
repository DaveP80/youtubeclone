import React from 'react'
import { useState, useEffect } from 'react'
import YouTube from 'react-youtube';
import {v1 as generateId} from 'uuid'

function Videos({ videos }) {

    const [results, setResults] = useState({})
    useEffect(() => {
        setResults({ ...videos })
    }, [videos])
    return (
        <>
            {
                Object.keys(results).length === 0 && (
                    <div className="alert alert-primary" role="alert">
                        No Search Results Yet!, Please submit a search above!
                    </div>
                )

            }
            {
                results.hasOwnProperty('response') && (
                    <div>
                        {results['response'].map((item, i) => {
                            return <div key={i}>
                                <YouTube id={generateId()} videoId={item['id']['videoId']} /></div>
                        })}
                    </div>
                )
            }

        </>
    )
}

export default Videos