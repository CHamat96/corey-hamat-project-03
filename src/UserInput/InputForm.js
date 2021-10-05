import {useState, useEffect} from 'react'
import axios from 'axios';

function UserInput(props){
  const [genres, setGenres] = useState([]);

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
    <>
    <form action="" onSubmit={props.formSubmit}>
      <label htmlFor="genreChoice">Please Select a Music Genre:</label>
        <select 
        name="genreChoice" 
        id="genreChoice" 
        onChange={props.genreInput}
        value={props.genre}>
          {genres.map((genre, index) => {
            return(
              <option key={index} value={genre.id}>{genre.name}</option>
            )
          })}
        </select>
      <button type="submit">Get Artists!</button>
    </form>
  </>
  )
}
export default UserInput