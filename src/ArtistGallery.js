import {useState} from 'react'

function DisplayArtists(props){

    const [artistChoice, setArtistChoice] = useState()
    // const [artistID, setArtistID] = useState()

    const artistSelect = (event) => {
      setArtistChoice(event.target.id)
    }

    const handleArtistChoice = (event) => {
      event.preventDefault()
      props.getAlbums(artistChoice)
    }


  return (
    <div className="bandContainer">
      <form action="" 
      onSubmit={handleArtistChoice}>
        <img src={props.photo} alt={props.name} />
        <label htmlFor="artistChoice" sr-only>Select a song by {props.name}</label>
        <button type='submit' id={props.id} onClick={artistSelect} value={artistChoice} name="artistChoice"> {props.name}</button>
      </form>      
    </div>
  )
}
export default DisplayArtists