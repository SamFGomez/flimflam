import { Component } from 'react';

class ActivityDetail extends Component {

  constructor(props){
      super(props);
      this.state = {
          selectedTracks:[],
          date: props.activity.date,
          duration: props.activity.duration,
          hr: props.activity.hr,
          id: props.activity.id,
          pace: props.activity.pace,
          milage: props.activity.milage,
          title: props.activity.title
      }
  }

  componentDidMount(){
    this.generateSongData();
  }

  filterDatetimesByRange(songList, startTime, durationSeconds) {
    const startDate = new Date(startTime.replace('Z', '')); // Ensure it's treated as UTC
    const endDate = new Date(startDate.getTime() + durationSeconds * 1000);

    return songList.filter(song => {
      const itemDate = new Date(song.played_at);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  generateSongData(){
    var songList = JSON.parse(sessionStorage.getItem("activitySongData"));

    // Convert duration (hh:mm:ss) to seconds
    const [hours, minutes, seconds] = this.state.duration.split(':').map(Number);
    const totalDurationSeconds = hours * 3600 + minutes * 60 + seconds;

    // Filter songs played during this activity
    const filteredSongs = this.filterDatetimesByRange(
      songList,  // Assuming songs have a played_at timestamp
      this.state.date,
      totalDurationSeconds
    );

    var mockData = filteredSongs.map(x=>{
      return {
        id: x.track.id,
        title: x.track.name,
        artist: x.track.artists.map(x=>x.name).join(", ")
      };
    });

    this.setState({trackList: mockData.reverse()});
  }

  selectTrack(track){
    var {selectedTracks} = this.state;

    var retVal = [];

    if(selectedTracks.includes(track.id)){
      retVal = selectedTracks.filter(x=>x!==track.id);
    } else {
      retVal = [...new Set([...selectedTracks, track.id])];
    }
    this.setState({selectedTracks: retVal});
  }

  createPlaylist(){
    var {selectedTracks,title,milage,pace} = this.state;

    var playlistTitle = "{0} - {1}".replace("{0}",new Date(this.state.date).toLocaleDateString()).replace("{1}", title);
    var playlistDescription = milage + " mi @ " + pace + " /mi pace";

    var authDetails = JSON.parse(sessionStorage.getItem('spotifyAuthDetails'));
    var url = process.env.REACT_APP_FLIMFLAM_API_URL + '/Music/CreatePlaylist?' + new URLSearchParams({
      access_token: authDetails?.access_token,
      title: playlistTitle,
      desc: playlistDescription,
      trackIds: selectedTracks.join(",")
    }).toString();

    fetch(url).then(response => response.json()).then(data =>{
      alert("Playlist Created Successfully!");
    })

  }
  render() {
    var {date, duration, hr, pace, milage,trackList,selectedTracks} = this.state;

    return (
      <div>
        <div id="ActivitySummary">
          <p>Date: {new Date(date.replace("Z", "")).toLocaleDateString()}</p>
          <p>Duration: {duration}</p>
          <p>Heart Rate: {hr}</p>
          <p>Pace: {pace}/mi</p>
          <p>Milage: {milage} mi</p>
        </div>
        <div id="TrackList">
          {trackList?.map((x,i)=>
            <button key={"Track_"+i} className={selectedTracks.includes(x.id) ? "TrackItem TrackItemSelected" : "TrackItem"} onClick={()=>this.selectTrack(x)}>
              <div className="TrackInfo">
                <p className="TrackTitle">{x.title}</p>
                <p className="TrackArtist">{x.artist}</p>
              </div>
              <div style={{alignSelf:"center"}}>
                {selectedTracks.includes(x.id) ? "✓" : "+"}
              </div>
            </button>
          )}
        </div>
        <div>
          <button id="CreatePlaylistButton" onClick={()=>{this.createPlaylist()}}>
            Create Playlist
          </button>
        </div>
        <div>
          <button id="SelectAllTracksButton" onClick={()=>{this.setState({selectedTracks: selectedTracks.length === trackList?.length ? [] : trackList?.map(x=>x.id)})}}>
            {selectedTracks.length === trackList?.length ? "Deselect All" : "Select All"}
          </button>
        </div>
      </div>
    );
  }
}

export default ActivityDetail;