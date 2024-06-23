import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './Playlists.css';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = () => {
    axios.get('http://127.0.0.1:8000/api/playlists/')
      .then(response => {
        setPlaylists(response.data);
      })
      .catch(error => {
        console.error('Error fetching playlists:', error);
      });
  };

  const handleLike = (playlistId) => {
    axios.post(`http://127.0.0.1:8000/api/playlists/${playlistId}/like`)
      .then(response => {
        console.log(response.data);
        fetchPlaylists();
      })
      .catch(error => {
        console.error('Error liking playlist:', error);
      });
  };

  return (
    <div>
      <h2>My Playlists</h2>
      {playlists.map(playlist => (
        <Card key={playlist.id} style={{ margin: '10px 0', position: 'relative' }}>
          <Card.Body>
            <Card.Title>{playlist.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Created by: {playlist.creator}</Card.Subtitle>
            <ListGroup className="list-group-flush">
              {playlist.songs.map(song => (
                <ListGroupItem key={song.id} className="song-item">
                  {song.title} - {song.artist}
                </ListGroupItem>
              ))}
            </ListGroup>
            <Button 
              variant="light" 
              className="like-button" 
              style={{ position: 'absolute', bottom: '10px', right: '10px' }} 
              onClick={() => handleLike(playlist.id)}
            >
              <FontAwesomeIcon icon={faHeart} /> {playlist.likes}
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Playlists;
