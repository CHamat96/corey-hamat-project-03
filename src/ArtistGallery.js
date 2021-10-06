import {useState} from 'react'

function DisplayArtists(props){

    const [artistChoice, setArtistChoice] = useState()

    // When the user selects an artist, log the selected artist's/button's ID into artistChoice state
    const artistSelect = (event) => {
      setArtistChoice(event.target.id)
    }

    // the selected button will also submit the form, which will take the new artistChoice value & use it as param in getSong API Call
    const handleArtistChoice = (event) => {
      event.preventDefault()
      props.getSong(artistChoice)
    }


  return (
    <div className="bandContainer">
      <form action="" 
      onSubmit={handleArtistChoice}>
        <img src={props.photo} alt={props.name} />
        <button type='submit' id={props.id} onClick={artistSelect} value={artistChoice} name="artistChoice"> {props.name}</button>
      </form>      
    </div>
  )
}
export default DisplayArtists