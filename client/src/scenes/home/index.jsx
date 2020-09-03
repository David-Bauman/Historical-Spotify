import React from 'react';
import {Playlists} from './playlists';

export default () => (
  <div className='information-container'>
    <div className='spaced'>
      <h1 className='header'>
        Most Viewed Playlists
      </h1>
      <div style={{padding: '0', marginRight: 'auto', marginLeft: 'auto'}}>
        <Playlists />
      </div>
    </div>
  </div>
);
