import React from 'react'
import { useState, useEffect } from 'react'
import YouTube from 'react-youtube';
import {v1 as generateId} from 'uuid'
import './videos.css'

function Videos({ videos }) {

    const [results, setResults] = useState({})
    useEffect(() => {
        setResults({ ...videos })
    }, [videos])
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
        },
      };
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
                            return <div key={i} className="col-lg-6 col-md-12">
                                <div className='grid-element'>
                                <YouTube id={generateId()} opts={opts} onReady={YouTube.onReady} videoId={item['id']['videoId']} />
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