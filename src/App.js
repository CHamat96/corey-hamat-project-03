import './styles/scss/styles.css';
import UserInput from './UserInput/InputForm.js';
import DisplayArtists from './ArtistGallery.js';
import axios from 'axios';
import {useState, useEffect} from 'react'
import realtime from './firebase.js';
import {ref, onValue, push} from 'firebase/database'

function App() {
  const [genreID, setGenreID] = useState(0)
  const [bands, setBands] = useState([])
  const [userPlaylist, setUserPlaylist] = useState([])
  
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


  const genreChange = (event) => {
    setGenreID(event.target.value)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    displayArtists(genreID)
  }

  const displayArtists = (id) => {
    axios({
      url:`https://proxy.hackeryou.com`,
      method:'GET',
      dataResponse:'json',
      params:{
        reqUrl:`http://api.deezer.com/genre/${id}/artists`
      }
    })
    .then((response) => {
      const artists = response.data
      setBands(artists.data)
    })
  }

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
      console.log(pickSong)
      const dbRef = ref(realtime)
      push(dbRef, pickSong)
    })
  }

  return (
    <div className="App">
      <header>
        <div className="wrapper">
          <div className="siteHeading">
          <h1>The Perfect Personal Playlist Procurement Program</h1>
          <p>Select your favourite music genre, find an artist or band that you like, then randomly add a song to your own <span>personal playlist</span>!</p>
          </div>
          <UserInput 
          formSubmit={handleFormSubmit}
          genre={genreID}
          genreInput={genreChange}
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
                photo={artist.picture}
                getAlbums={getAlbums}
                />
              )
            })}
            </div>
          </section>
          <section className="displayPlaylist">
            {userPlaylist.length > 0 ? (
            <>
              <h2>Your Playlist:</h2>
              <ol className="playlist">
                {userPlaylist.map((song) => {
                  const {title, link, artist, id} = song.data
                  return (
                    <li key={id}>
                      <a href={link}><span>{title}</span> by {artist.name}</a>
                    </li>
                  )
                })}
              </ol>
            </>
            ) : (
              <>
                <h2>Select an artist to add a song to your playlist!</h2>
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
