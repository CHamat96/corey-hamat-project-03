import {useState} from 'react'

function DisplayArtists(props){

    const [artistChoice, setArtistChoice] = useState()

    const artistSelect = (event) => {
      setArtistChoice(event.target.id)
    }

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