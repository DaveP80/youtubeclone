import React from 'react'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaCopy } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
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
    const commCollection = collection(db, 'comments')
    const [comments, setComments] = useState([])
    const [field, setField] = useState({})
    const [nocomm, setnoComm] = useState(null)
    const [showEditForm, setShowEditForm] = useState(null);
    const [showDelete, setShowDelete] = useState(null)
    const [editedComment, setEditedComment] = useState('');
    const [hash, setHash] = useState('');
    const [d_hash, setDHash] = useState('');
    const [verify, setVerify] = useState(null)
    const [newField, setNewField] = useState(null)

    const getComments = async (args) => {
        try {
            const data = await getDoc(doc(db, 'comments', id))
            setField(data.data())
            setComments(commentList([...Object.values(data.data()).map((item) => { return [item.name, item.comment] })]))

        } catch (e) {
            if (args) {
                alert('failed to connect to storage')
                setEditedComment('')
                setHash('')
                setDHash('')
                setShowDelete(null)
                setShowEditForm(null)
            }
            console.log(e)
        }
    }
    // eslint-disable-next-line
    useEffect(() => {
        getComments();
    }, [])

    useEffect(() => {
        let checkBoolean = checkfieldObj(field)
        if (checkBoolean) setnoComm(true)
        else setnoComm(false)
    }, [field])

    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    //remove possible duplicate fields from firestore
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
    //build a field entry for the firebase collection
    async function commentsList() {
        let newfield = { [generateId()]: { name: name.trim(), comment: comment.trim() } }
        await setDoc(doc(commCollection, id), { ...field, ...newfield })
        setNewField(newfield)
        setVerify(true)
        setField({ ...field, ...newfield })
        setComments(commentList([...comments, [name.trim(), comment.trim()]]))
        setName('');
        setComment('');
    }

    function checkfieldObj(args) {
        let isEmpty = true;

        for (const key in args) {
            if (args.hasOwnProperty(key)) {
                isEmpty = false;
                break;
            }
        }
        if (isEmpty) return true
        else return false
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !comment) return
        //prevent duplicate name,comment in the firestore document
        if (checkfieldObj(field)) {
            commentsList()
            return
        } else if (Object.values(field).map((item) => { return [item.name, item.comment] }).some(item => item[0] === name.trim() && item[1] === comment.trim())) {
            return
        } else {
            commentsList()
        }
    };

    function handleDelete(args) {
        if (showDelete === args) {
            setDHash('')
            setShowDelete(null)
        }
        else setShowDelete(args)
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
        if (field.hasOwnProperty(hash) && field[hash].name === args && field[hash].comment === argsC) {
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

    const handleRemoveComm = async (e, args, argsD) => {
        e.preventDefault()
        if (field.hasOwnProperty(d_hash) && field[d_hash].name === args && field[d_hash].comment === argsD) {
            let obj = { ...field }
            delete obj[d_hash]
            await setDoc(doc(commCollection, id), { ...obj })
            getComments(true)
            setDHash('')
            setShowDelete(null)
        } else {
            alert('incorrect code')
            setDHash('')
        }
    }

    const closeModal = () => {
        setVerify(false);
        setNewField(null)
    };

    const copyToClipboard = () => {
        let c = document.getElementById('keycode')
        navigator.clipboard.writeText(c.textContent)
        closeModal()
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
                        {
                            verify && (
                                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Thanks for commenting</h5>
                                            </div>
                                            <div className="modal-body">
                                                <p>Your code to edit/delete: <span id='keycode'>{Object.keys(newField)[0]}</span></p>
                                            </div>
                                            <button type="button" className="btn btn-link" onClick={copyToClipboard}>
                                                <FaCopy />
                                            </button>
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
                                    {showDelete === index ? (
                                        <form onSubmit={(e) => handleRemoveComm(e, comment[0], comment[1])}>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control mb-1"
                                                    id="d_hashcode"
                                                    value={d_hash}
                                                    onChange={(e) => setDHash(e.target.value)}
                                                    placeholder='passcode'
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary">
                                                Delete
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