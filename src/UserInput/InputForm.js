import {useState, useEffect} from 'react'
import axios from 'axios';

function UserInput(props){
  const [genres, setGenres] = useState([]);

  // When page loads, gather all "genre" objects from Deezer API, set them to the 'genres' state, then map the new array into HTML <option> elements
  useEffect(() => {
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
  }, [])

    //  When the user changes the genre option, set the genreID state to the selected Genre ID
  const genreChange = (event) => {
    props.setGenreID(event.target.value)
  }

  // When user submits form, use the selected genreID in API call to display artists that fit the genre
  const handleGenreChange = (event) => {
    event.preventDefault()
    displayArtists(props.genreID)
  }

  // Genre-Artist API request
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

  // When user types the name of a band, log their input with the setBandQuery state (called in InputForm component as setBandInput)
  const bandSearchInput = (event) => {
    props.setBandInput(event.target.value)
  }

  // When user submits second 'search' form, use 'bandInput' prop/bandQuery component to make another API call to fetch artists that match the user's query 
  const handleBandSearch = (event) => {
    event.preventDefault();
    bandSearch(props.bandInput)
  }

  // API call, results are logged in same 'results' state as the results of the genre search
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
            {/* map the genres array to render HTML <option> elements for every genre in Deezer database */}
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