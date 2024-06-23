import React, { useEffect, useState } from 'react';

const SpotifyPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem('spotify_access_token');
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
      });

      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      player.addListener('player_state_changed', state => { console.log(state); });

      player.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        console.log('Ready with Device ID', device_id);
      });

      player.connect();
      setPlayer(player);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  const playSong = async (spotify_uri) => {
    const token = localStorage.getItem('spotify_access_token');
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
  };

  return (
    <div>
      <h2>Spotify Player</h2>
      <button onClick={() => player.togglePlay()}>Play/Pause</button>
      <button onClick={() => playSong('spotify:track:your_track_uri')}>Play Specific Song</button>
    </div>
  );
};

export default SpotifyPlayer;
