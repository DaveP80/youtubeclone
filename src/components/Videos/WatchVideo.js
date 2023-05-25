import React from 'react'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, addDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase-config'
import { v1 as generateId } from 'uuid'
import './videos.css'

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
    const [showEditForm, setShowEditForm] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const [hash, setHash] = useState('');

    async function getComments(args) {

        try {
            const data = await getDoc(doc(db, 'comments', id))
            setField(data.data())
            setComments(commentList([...Object.values(data.data()).map((item) => { return [item.name, item.comment] })]))

        } catch {
            if (args) {
                alert('failed to connect to storage')
                setEditedComment('')
                setHash('')
                setShowEditForm(null)
            } else setnoComm(!nocomm)
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
        //prevent duplicate name,comment in the firestore document
        if (Object.values(field).map((item) => { return [item.name, item.comment] }).some(item => item[0] === name.trim() && item[1] === comment.trim())) { return }

        let newfield = { [generateId()]: { name: name.trim(), comment: comment.trim() } }
        await setDoc(doc(commCollection, id), { ...field, ...newfield })
        setField({ ...field, ...newfield })
        setComments(commentList([...comments, [name.trim(), comment.trim()]]))
        setnoComm(false)

        setName('');
        setComment('');
    };

    function handleDelete(args) {
        return
    }

    function handleUpdate(args) {

        if (showEditForm === args) {
            setEditedComment('')
            setComment('')
            setHash('')
            setShowEditForm(null)
        }
        else setShowEditForm(args)
    }
    //function to handle editing comments under the video
    const handleEdit = async (e, args, argsC) => {
        e.preventDefault()
        if (Object.keys(field).includes(hash)) {
            if (argsC === editedComment.trim()) return
            let editField = { [hash]: { name: args, comment: editedComment.trim() } }
            await setDoc(doc(commCollection, id), { ...field, ...editField })
            getComments(true)
            setEditedComment('')
            setHash('')
            setShowEditForm(null)
        } else {
            alert('wrong passcode')
            setHash('')
            setEditedComment('')
            return
        }
    }
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
                                    <FaTrash
                                        onClick={() => handleDelete(index)}
                                        className="icon delete-icon"
                                    />
                                    <FaEdit
                                        onClick={() => handleUpdate(index)}
                                        className="icon edit-icon"
                                    />
                                    {showEditForm === index ? (
                                        <form onSubmit={(e) => handleEdit(e, comment[0], comment[1])}>
                                            <div className="form-group">
                                                <label htmlFor="editComment">Edit Comment</label>
                                                <input
                                                    type="text"
                                                    className="form-control mb-1"
                                                    id="hashcode"
                                                    value={hash}
                                                    onChange={(e) => setHash(e.target.value)}
                                                    placeholder='passcode'
                                                />
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="editComment"
                                                    value={editedComment}
                                                    onChange={(e) => setEditedComment(e.target.value)}
                                                    placeholder='updated comment'
                                                    required
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary">
                                                Update
                                            </button>
                                        </form>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        )}
                        {
                            nocomm && <div className="alert alert-primary" role="alert">
                                Be the First to Comment on this video!
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatchVideo