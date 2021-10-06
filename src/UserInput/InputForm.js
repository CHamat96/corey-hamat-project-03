import {useState, useEffect} from 'react'
import axios from 'axios';

function UserInput(props){
  const [genres, setGenres] = useState([]);

  useEffect((props) => {
    axios({
      url:'https://proxy.hackeryou.com/',
      method:'GET',
      dataResponse:'json',
      params: {
        reqUrl:'http://api.deezer.com/genre'
      }
    })
    .then((response) => {
        const results = response.data
        setGenres(results.data)
    })

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
        props.setBandResults(results.data)
    })
  }, [])

  
  const genreChange = (event) => {
    props.setGenreID(event.target.value)
  }

  const handleGenreChange = (event) => {
    event.preventDefault()
    displayArtists(props.genreID)
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
      props.setBandResults(artists.data)
    })
  }

  const bandSearchInput = (event) => {
    props.setBandInput(event.target.value)
  }

  const handleBandSearch = (event) => {
    event.preventDefault();
    bandSearch(props.bandInput)
  }

  const bandSearch = (query) => {
    axios({
      url:'https://proxy.hackeryou.com',
      method:'GET',
      dataResponse:'json',
      params:{
        reqUrl:`http://api.deezer.com/search/artist?q="${query}"`,
      },
    })
    .then((response) => {
      const results = response.data
      props.setBandResults(results.data)
    })
  }



  return (
    <div className="userSearch">
      <form action="" onSubmit={handleGenreChange}>
        <fieldset className="genreChoice">
          <label htmlFor="genreChoice">Please Select a Music Genre:</label>
          <select 
          name="genreChoice" 
          id="genreChoice" 
          onChange={genreChange}
          value={props.genreID}>
            {genres.map((genre, index) => {
              return(
                <option key={index} value={genre.id}>{genre.name}</option>
              )
            })}
          </select>
          <button type="submit">Get Artists!</button>
        </fieldset>
      </form>
      <form action="" onSubmit={handleBandSearch}>
        <fieldset>
          <label htmlFor="bandSearch">OR Search for your favourite band</label>
          <input 
          type="search" 
          name="bandSearch" 
          id="bandSearch" 
          onChange={bandSearchInput}
          value={props.bandInput}/>
          <button type="submit">Search</button>
        </fieldset>
      </form>
    </div>
  )
}
export default UserInput