import {useState, useEffect} from 'react'
import axios from 'axios';
import useInputValue from '../utils/getInputValue.js';

function UserInput(props){
  const [genres, setGenres] = useState([]);

    // custom useInputValue hook declarations
  const [bandQuery, handleBandQuery] = useInputValue('')
  const [genreID, handleGenreChange] = useInputValue(0)

  // deconstruct props
  const {displayBandsGenre, displayBandsQuery} = props

    // When user submits form, use the selected genreID in API call to display artists that fit the genre
    const genreSubmit = (event) => {
      event.preventDefault()
      displayBandsGenre(genreID)
    }
  
    // When user submits second 'search' form, use 'bandInput' prop/bandQuery component to make another API call to fetch artists that match the user's query 
    const bandSubmit = (event) => {
      event.preventDefault();
      displayBandsQuery(bandQuery)
    }
  


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

  return (
    <div className="userSearch">
      <form action="" onSubmit={genreSubmit}>
        <fieldset className="genreChoice">
          <label htmlFor="genreChoice">Please Select a Music Genre:</label>
          <select 
          name="genreChoice"
          id="genreChoice" 
          onChange={handleGenreChange}
          value={genreID}>
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
      <form action="" onSubmit={bandSubmit}>
        <fieldset>
          <label htmlFor="bandSearch">OR Search for your favourite band</label>
          <input 
          type="search" 
          name="bandSearch" 
          id="bandSearch" 
          onChange={handleBandQuery}
          value={bandQuery}/>
          <button type="submit">Search</button>
        </fieldset>
      </form>
    </div>
  )
}
export default UserInput