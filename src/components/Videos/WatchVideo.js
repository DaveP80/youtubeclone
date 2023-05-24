import React from 'react'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube';
import { Link } from 'react-router-dom';

function WatchVideo() {

    const { id } = useParams()
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        }
    };
    return (
        <>
            <div className='mb-2'>
                <Link to="/home">
                    <button className="btn btn-primary">Back to Results</button>
                </Link>
            </div>
            <YouTube opts={opts} onReady={YouTube.onReady} videoId={id} />
        </>
    )
}

export default WatchVideo