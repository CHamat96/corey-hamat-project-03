import './styles/scss/styles.css';
import UserInput from './UserInput/InputForm.js';
import DisplayArtists from './ArtistGallery.js';
import axios from 'axios';
import {useState, useEffect} from 'react'
import realtime from './firebase.js';
import {ref, onValue, push, remove} from 'firebase/database'

function App() {
  const [bands, setBands] = useState([])
  const [userPlaylist, setUserPlaylist] = useState([])
  const [bandQuery, setBandQuery] = useState('')
  const [genreID, setGenreID] = useState(0)

  useEffect(() => {
    const dbRef = ref(realtime)
    onValue(dbRef, (snapshot) => {
      const realtimeData = snapshot.val()
      const playlist = []
      for(let property in realtimeData) {
        const song = {
          key:property,
          data:realtimeData[property]
        }
        playlist.push(song)
      }
      setUserPlaylist(playlist)
    })
  }, [])



  const getAlbums = (artistID) => {
    axios({
      url:'https://proxy.hackeryou.com',
      method:'GET',
      dataResponse:'json',
      params:{
        reqUrl:`http://api.deezer.com/artist/${artistID}/albums`
      }
    })
    .then((response) => {
      const allAlbums = response.data
      const randomAlbum = random(allAlbums.data)
      getSong(randomAlbum)
    })
  }

  const random = (array) => {
    const index = Math.floor(Math.random() * array.length)
    return array[index]
  }
  

  const findSong = async (album) => {
    const id = album.id
    const songSearch = await axios({
      url:'https://proxy.hackeryou.com',
      method:'GET',
      dataResponse:'json',
      params:{
        reqUrl:`http://api.deezer.com/album/${id}/tracks`
      }  
    })
    return songSearch
  }

  const getSong = (album) => {
    const albumInfo = findSong(album)
    albumInfo
    .then((response) => {
      const tracklist = response.data
      const pickSong = random(tracklist.data)
      const dbRef = ref(realtime)
      push(dbRef, pickSong)
    })
  }

  const handleRemoveSong = (event) => {
    const songKey = event.target.value
    const songRef = ref(realtime, songKey)
    remove(songRef)
  }

  return (
    <div className="App">
      <header>
        <div className="wrapper">
          <div className="siteHeading">
          <h1>The Perfect Playlist Procurement Program</h1>
          <p>Select your favourite music genre & select an artist or band that you like, or search for that band yourself, then randomly add a song to a global Playlist, created by music-lovers across the internet!</p>
          </div>
          <UserInput 
          genreID={genreID}
          setGenreID={setGenreID}
          bandInput={bandQuery}
          setBandInput={setBandQuery}
          setBandResults={setBands}
          />
        </div>
      </header>
      <main>
        <div className="wrapper">
          <section className="selectArtist">
            <div className="artistGallery">
            {bands.map((artist, index) => {
              return (
                <DisplayArtists
                key={index}
                name={artist.name}
                id={artist.id}
                photo={artist.picture_medium}
                getAlbums={getAlbums}
                />
              )
            })}
            </div>
          </section>
          <section className="displayPlaylist">
            {userPlaylist.length > 0 ? (
            <>
              <h2>The 'Perfect' Playlist:</h2>
              <ol className="playlist">
                {userPlaylist.map((song) => {
                  const {key} = song
                  const {title, link, artist, id} = song.data
                  return (
                    <li key={id}>
                      <a href={link}><span>{title}</span> by {artist.name}</a>
                      <button 
                      value={key}
                      onClick={handleRemoveSong}>delete song</button>
                    </li>
                  )
                })}
              </ol>
            </>
            ) : (
              <>
                <h2>Select an artist to add a song to the playlist!</h2>
              </>
            )}
          </section>
        </div>
      </main>
      <footer>
        <a href="https://developers.deezer.com">Powered by the Deezer API</a>
        <a href="https://www.junocollege.ca">Created at Juno College of Technology</a>
      </footer>
    </div>
  );
}

export default App;
