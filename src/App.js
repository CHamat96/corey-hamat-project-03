import './App.css';
import UserInput from './UserInput/InputForm.js';
import DisplayArtists from './ArtistGallery.js';
import axios from 'axios';
import {useState, useEffect} from 'react'

function App() {
  const [genreID, setGenreID] = useState('')
  const [bands, setBands] = useState([])

  const genreChange = (event) => {
    setGenreID(event.target.value)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    displayArtists(genreID)
  }
  useEffect(() => {
    axios({
      url:`https://proxy.hackeryou.com`,
      method:'GET',
      dataResponse:'json',
      params:{
        reqUrl:`http://api.deezer.com/genre/0/artists`
      }
    })
    .then((response) => {
      const artists = response.data
      setBands(artists.data)
  })
}, [])

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

  return (
    <div className="App">
      <header>
        <div className="siteHeading">
        <h1>The Perfect Personal Playlist Procurement Program</h1>
        </div>
        <UserInput 
        formSubmit={handleFormSubmit}
        genre={genreID}
        genreInput={genreChange}/>
      </header>
      <main>
        <div className="artistGallery">
        {bands.map((artist, index) => {
          return (
            <DisplayArtists
            key={index}
            name={artist.name}
            id={artist.id}
            photo={artist.picture}
            />
          )
        })}
        </div>
      </main>
    </div>
  );
}

export default App;
