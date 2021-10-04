
function DisplayArtists(props){
  return (
    <div className="bandContainer">
      <img src={props.photo} alt={props.name} />      
      <button value={props.id}>
        <h3>{props.name}</h3>
      </button>
    </div>
  )
}
export default DisplayArtists