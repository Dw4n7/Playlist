import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus, faHeart } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

function Home({ currentUser }) {
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showSongModal, setShowSongModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistGenre, setNewPlaylistGenre] = useState('');
  const [newSong, setNewSong] = useState({ playlistId: '', title: '', artist: '', duration: '' });
  const [editPlaylist, setEditPlaylist] = useState(null);
  const [editSong, setEditSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchGenre, setSearchGenre] = useState('');

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists/', { withCredentials: true });
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleLike = async (playlistId) => {
    try {
      const response = await axios.post(`/api/playlists/${playlistId}/like/`, {}, { withCredentials: true });
      setPlaylists(playlists.map(playlist => (
        playlist.id === playlistId ? { ...playlist, likes: response.data.likes } : playlist
      )));
    } catch (error) {
      console.error('Error liking playlist:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newPlaylistName);
      formData.append('genre', newPlaylistGenre);

      await axios.post('/api/playlists/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      setNewPlaylistName('');
      setNewPlaylistGenre('');
      setShowPlaylistModal(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleEditPlaylist = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editPlaylist.name);
      formData.append('genre', editPlaylist.genre);

      await axios.put(`/api/playlists/${editPlaylist.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      setEditPlaylist(null);
      setShowPlaylistModal(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Error editing playlist:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/api/playlists/${playlistId}`, {
        withCredentials: true
      });

      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleAddSong = async () => {
    try {
      const formData = new FormData();
      formData.append('playlistId', newSong.playlistId);
      formData.append('title', newSong.title);
      formData.append('artist', newSong.artist);
      formData.append('duration', newSong.duration);

      await axios.post('/api/add-song/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      setNewSong({ playlistId: '', title: '', artist: '', duration: '' });
      setShowSongModal(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Error adding song', error);
    }
  };

  const handleEditSong = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editSong.title);
      formData.append('artist', editSong.artist);
      formData.append('duration', editSong.duration);

      await axios.put(`/api/songs/${editSong.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      setEditSong(null);
      setShowSongModal(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Error editing song:', error);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      await axios.delete(`/api/songs/${songId}`, {
        withCredentials: true
      });

      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    playlist.genre.toLowerCase().includes(searchGenre.toLowerCase())
  );

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>Welcome, {currentUser}</h2>
          <Button variant="primary" className="btn-create-playlist" onClick={() => setShowPlaylistModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Create New Playlist
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search Playlists"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="Search by Genre"
            value={searchGenre}
            onChange={(e) => setSearchGenre(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        {filteredPlaylists.length > 0 ? (
          filteredPlaylists.map((playlist) => (
            <Col key={playlist.id} md={4}>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">{playlist.name}</h5>
                  <p className="card-text">Genre: {playlist.genre}</p>
                  <Button variant="primary" className="btn-create-song me-2" onClick={() => setShowSongModal(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                  <Button variant="warning" className="btn-icon me-2" onClick={() => setEditPlaylist(playlist)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button variant="danger" className="btn-icon" onClick={() => handleDeletePlaylist(playlist.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                    variant="link"
                    className="like-button"
                    onClick={() => handleLike(playlist.id)}
                    style={{ position: 'absolute', bottom: '5px', right: '10px', color: 'red' }}
                  >
                    <FontAwesomeIcon icon={faHeart} /> {playlist.likes}
                  </Button>
                  <ul className="list-group list-group-flush mt-2">
                    {playlist.songs && playlist.songs.map((song) => (
                      <li key={song.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          {song.title} - {song.artist} ({song.duration} min)
                        </div>
                        <div>
                          <Button variant="warning" className="btn-icon me-2" onClick={() => setEditSong(song)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button variant="danger" className="btn-icon" onClick={() => handleDeleteSong(song.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <Col>
            <p>No playlists found</p>
          </Col>
        )}
      </Row>

      {/* Create/Edit Playlist Modal */}
      <Modal show={showPlaylistModal || editPlaylist} onHide={() => { setShowPlaylistModal(false); setEditPlaylist(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editPlaylist ? 'Edit Playlist' : 'Create New Playlist'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPlaylistName">
              <Form.Label>Playlist Name</Form.Label>
              <Form.Control
                type="text"
                value={editPlaylist ? editPlaylist.name : newPlaylistName}
                onChange={(e) => editPlaylist ? setEditPlaylist({ ...editPlaylist, name: e.target.value }) : setNewPlaylistName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPlaylistGenre">
              <Form.Label>Playlist Genre</Form.Label>
              <Form.Control
                type="text"
                value={editPlaylist ? editPlaylist.genre : newPlaylistGenre}
                onChange={(e) => editPlaylist ? setEditPlaylist({ ...editPlaylist, genre: e.target.value }) : setNewPlaylistGenre(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowPlaylistModal(false); setEditPlaylist(null); }}>
            Close
          </Button>
          <Button variant="primary" onClick={editPlaylist ? handleEditPlaylist : handleCreatePlaylist}>
            {editPlaylist ? 'Edit Playlist' : 'Create Playlist'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Song Modal */}
      <Modal show={showSongModal || editSong} onHide={() => { setShowSongModal(false); setEditSong(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editSong ? 'Edit Song' : 'Add New Song'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSongPlaylist">
              <Form.Label>Playlist</Form.Label>
              <Form.Control
                as="select"
                value={editSong ? editSong.playlistId : newSong.playlistId}
                onChange={(e) => editSong ? setEditSong({ ...editSong, playlistId: e.target.value }) : setNewSong({ ...newSong, playlistId: e.target.value })}
                disabled={!!editSong}
              >
                <option value="">Select Playlist</option>
                {playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSongTitle">
              <Form.Label>Song Title</Form.Label>
              <Form.Control
                type="text"
                value={editSong ? editSong.title : newSong.title}
                onChange={(e) => editSong ? setEditSong({ ...editSong, title: e.target.value }) : setNewSong({ ...newSong, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formSongArtist">
              <Form.Label>Artist</Form.Label>
              <Form.Control
                type="text"
                value={editSong ? editSong.artist : newSong.artist}
                onChange={(e) => editSong ? setEditSong({ ...editSong, artist: e.target.value }) : setNewSong({ ...newSong, artist: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formSongDuration">
              <Form.Label>Duration (min)</Form.Label>
              <Form.Control
                type="text"
                value={editSong ? editSong.duration : newSong.duration}
                onChange={(e) => editSong ? setEditSong({ ...editSong, duration: e.target.value }) : setNewSong({ ...newSong, duration: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowSongModal(false); setEditSong(null); }}>
            Close
          </Button>
          <Button variant="primary" onClick={editSong ? handleEditSong : handleAddSong}>
            {editSong ? 'Edit Song' : 'Add Song'}
          </Button>
        </Modal.Footer>
      </Modal>

<br />
<br />
<br />
<br />
      <footer className="footer">
        Proyecto integrador Cesde - Kevin y Duan
      </footer>
    </Container>
  );
}

export default Home;
