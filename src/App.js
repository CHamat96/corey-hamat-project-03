// stylesheet import
import './styles/scss/styles.css';

// component import
import UserInput from './components/InputForm.js';
import DisplayArtists from './components/ArtistGallery.js';
import Playlist from './components/Playlist.js'

// util import
import realtime from './utils/firebase.js';

// package import
import axios from 'axios';
import {useState, useEffect} from 'react'
import {ref, onValue, push, remove} from 'firebase/database'

function App() {
  // useState declarations
  const [bands, setBands] = useState([])
  const [userPlaylist, setUserPlaylist] = useState([])
  const [initSearch, setInitSearch] = useState(true)

  useEffect(() => {
    
    axios({
      url:'https://proxy.hackeryou.com/',
      method:'GET',
      dataResponse:'json',
      params: {
        reqUrl:'http://api.deezer.com/chart/0/artists'
      }
    })
    .then((response) => {
        const results = response.data
        setBands(results.data)
    })
    // when page loads, start listening for changes to firebase
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

  

  // Genre-Artist API request
  const displayBandsGenre = (id) => {
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


    // API call, results are logged in same 'results' state as the results of the genre search
    const displayBandsQuery = (query) => {
      axios({
        url:'https://proxy.hackeryou.com',
        method:'GET',
        dataResponse:'json',
        params:{
          reqUrl:`http://api.deezer.com/search/artist?q=${query}`
        },
      })
      .then((response) => {
        const results = response.data
        setBands(results.data)
      })
    }

  
// Async API call to get selected artist's top 100 songs
  const findSong = async (id) => {
    const songSearch = await axios({
      url:'https://proxy.hackeryou.com',
      method:'GET',
      dataResponse:'json',
      params:{
        reqUrl:`http://api.deezer.com/artist/${id}/top?limit=100`,
      }  
    })
    return songSearch
  }

  // Call tracklist API call, then pick random object from response array & push to dbRef
  const getSong = (id) => {
    const tracklist = findSong(id)
    console.log(tracklist)
    tracklist
    .then((response) => {
      const tracklist = response.data
      const pickSong = random(tracklist.data)
      const dbRef = ref(realtime)
      push(dbRef, pickSong)
    })
  }

    // Random # function that targets an array param
    const random = (array) => {
      const index = Math.floor(Math.random() * array.length)
      return array[index]
    }

  // When user clicks the 'remove' button, target the selected object's key # & remove from firebase
  const handleRemoveSong = (event) => {
    const songKey = event.target.value
    const songRef = ref(realtime, songKey)
    remove(songRef)
  }

  const handleInitSearch = () => {
    setInitSearch(!initSearch)
    console.log(initSearch)
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
          displayBandsGenre={displayBandsGenre}
          displayBandsQuery={displayBandsQuery}
          handleInitSubmit={handleInitSearch}
          />
        </div>
      </header>
      <main>
        <div className="wrapper">
          <section className="selectArtist">
            <div className="artistGallery">
            {initSearch === true || bands.length !== 0 ?
              bands.map((artist, index) => {
                return (
                  <DisplayArtists
                  key={index}
                  name={artist.name}
                  id={artist.id}
                  photo={artist.picture_medium}
                  getSong={getSong}
                  />
                )
              }) :
              (
                <h3>Sorry! I could not find any artists! Try again?</h3>
              )
            }
            </div>
          </section>
          <Playlist 
          userPlaylist={userPlaylist}
          deleteSong={handleRemoveSong}/>
        </div>
      </main>
      <footer>
        <p>©2021 Corey Hamat</p>
        <a href="https://developers.deezer.com">Powered by the Deezer API</a>
        <a href="https://www.junocollege.com">Created at Juno College of Technology</a>
      </footer>
    </div>
  );
}

export default App;
