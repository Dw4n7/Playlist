import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function SpotifyAuth() {
  const location = useLocation();

  useEffect(() => {
    const fetchToken = async () => {
      const code = new URLSearchParams(location.search).get('code');
      try {
        const response = await axios.get(`/api/spotify/callback?code=${code}`);
        const { access_token } = response.data;
        localStorage.setItem('spotify_access_token', access_token);
        alert('Spotify authentication successful');
      } catch (error) {
        console.error('Error during Spotify authentication:', error);
      }
    };

    fetchToken();
  }, [location]);

  return <div>Spotify Authentication</div>;
}

export default SpotifyAuth;
