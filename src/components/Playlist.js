function Playlist(props) {
  const {userPlaylist, deleteSong} = props
  return (
    <section className="displayPlaylist">
      {userPlaylist.length > 0 ? (
      <>
        <h2>The 'Perfect' Playlist:</h2>
        <ol className="playlist">
          {userPlaylist.map((song) => {
            const {key} = song
            const {title, link, artist, id, album} = song.data
            return (
              <li key={id}>
                <div className="songContainer">
                  <img src={album.cover} alt={album.title} />
                  <div className="songInfo">
                    <a href={link}><span>{title}</span> by {artist.name}</a>
                    <button 
                    value={key}
                    onClick={deleteSong}>delete song</button>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </>
      ) : (
        <>
          <h2>Select an artist to add a song to the playlist!</h2>
        </>
      )}
  </section>
  )
}
export default Playlist