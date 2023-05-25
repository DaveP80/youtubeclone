import React from 'react'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, addDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase-config'
import { v1 as generateId } from 'uuid'

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
    const [comments, setComments] = useState([])
    const [field, setField] = useState({})
    const [nocomm, setnoComm] = useState(false)
    const commCollection = collection(db, 'comments')
    async function getComments() {

        try {
            const data = await getDoc(doc(db, 'comments', id))
            setField(data.data())
            setComments(commentList([...comments, ...Object.values(data.data()).map((item) => { return [item.name, item.comment] })]))

        } catch {
            setnoComm(!nocomm)
        }
    }
    useEffect(() => {
        getComments()
    }, [])
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');

    function commentList(arr) {
        return arr.filter((subArray, index, self) => {
            return !self.slice(index + 1).some((otherSubArray) => {
                return (
                    otherSubArray.length === subArray.length &&
                    otherSubArray.every((value, i) => value === subArray[i])
                );
            });
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !comment) return

        let newfield = { [generateId()]: { name: name.trim(), comment: comment.trim() } }
        await setDoc(doc(commCollection, id), { ...field, ...newfield })
        setField({ ...field, ...newfield })
        setComments(commentList([...comments, [name.trim(), comment.trim()]]))
        setnoComm(false)

        setName('');
        setComment('');
    };
    return (
        <>
            <div className='mb-2'>
                <Link to="/home">
                    <button className="btn btn-primary">Back to Results</button>
                </Link>
            </div>
            <YouTube opts={opts} onReady={YouTube.onReady} videoId={id} />
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">

                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-group">

                        <textarea
                            className="form-control mt-2"
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Enter your comment"
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary my-2">
                        Submit
                    </button>
                </form>
                <div className="container">
                    <div className="row">
                        {comments.length > 0 && comments.map((comment, index) => <div className="col-md-4" key={index}>
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">{comment[0]} 🗣️says</h5>
                                    <p className="card-text">{comment[1]}</p>
                                </div>
                            </div>
                        </div>
                        )}
                        {
                            nocomm && <div className="alert alert-primary" role="alert">
                                No Search Results Yet!, Please submit a search above!
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatchVideo