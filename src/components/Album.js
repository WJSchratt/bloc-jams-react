import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar'

class Album extends Component {
  constructor(props) {
     super(props);

     const album = albumData.find( album => {
         return album.slug === this.props.match.params.slug;
       });

       this.state = {
         album: album,
         currentSong: album.songs[0],
         currentTime: 0,
         duration: album.songs[0].duration,
         currentVolume: 0.2,
         isPlaying: false
       };

       this.audioElement = document.createElement('audio');
       this.audioElement.src = album.songs[0].audioSrc;
     }

      componentDidMount() {
        this.eventListeners = {
         timeupdate: e => {
           this.setState({ currentTime: this.audioElement.currentTime });
         },
         durationchange: e => {
           this.setState({ duration: this.audioElement.duration });
         },
         volumeChange: e => { 
           this.setState({ currentVolume: this.audioElement.volume}); 
          }, 
       };
         this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
         this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
         this.audioElement.addEventListener('volumeChange', this.eventListeners.volumeChange);

       }

       componentWillUnmount() {
         this.audioElement.src = null;
         this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
         this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
         this.audioElement.removeEventListener('volumeChange', this.eventListeners.volumeChange);
       }


     play() {
        this.audioElement.play();
        this.setState({ isPlaying: true });
      }

      pause() {
         this.audioElement.pause();
         this.setState({ isPlaying: false });
       }

       setSong(song) {
          this.audioElement.src = song.audioSrc;
          this.setState({ currentSong: song });
        }

        handleSongClick(song) {
         const isSameSong = this.state.currentSong === song;
         if (this.state.isPlaying && isSameSong) {
           this.pause();
         } else {
           if (!isSameSong) { this.setSong(song); }
           this.play();
         }
       }

       hover(song){
       this.setState({currentlyHoveredSong: song });
     }

     unHover(song){
       this.setState({currentlyHoveredSong: null});
     }

     songButtons(song, index) {
       if (this.state.currentlyHoveredSong === song) {
         if (this.state.currentSong === song) {
           if(this.state.isPlaying){
             return <span className = 'ion-md-pause'/>;
           }
           else{
             return <span className = 'ion-md-play-circle'/>;
           }
         }
         return <span className = 'ion-md-play-circle'/>;
       }
       else if(this.state.isPlaying && this.state.currentSong === song){
         return <span className = 'ion-md-pause'/>;
       }
       return index + 1;
     }

     handlePrevClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
     }

     handleForwClick() {
       const currentNewIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
       const newerIndex = Math.min(4, currentNewIndex + 1);
       const skipSong = this.state.album.songs[newerIndex];
       this.setSong(skipSong);
       this.play();
     }

     handleTimeChange(e) {
     const newTime = this.audioElement.duration * e.target.value;
     this.audioElement.currentTime = newTime;
     this.setState({ currentTime: newTime });
   }

   handleVolumeChange(e) {
     const newVolume = e.target.value;
     this.audioElement.volume = newVolume;
     this.setState({ currentVolume : newVolume });
   }

  formatTime(time) {
    const displayTime = this.Math.floor(time / 60)+':'+Math.floor(time % 60);
    this.setState({ currentTime : displayTime });
  }


   render() {
     console.log(this.state.duration)
     return (
       <section className="album">
         {this.props.match.params.slug} Album will go here
         <section id="album-info">
           <img id="album-cover-art" />
           <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
           <div className="album-details">
           <h1 id="album-title">{this.state.album.title}</h1>
           <h2 className="artist">{this.state.album.artist}</h2>
           <div id="release-info">{this.state.album.releaseInfo}</div>
           </div>
         </section>
         <table id="song-list">
          <colgroup>
            <col id="song-number-column"/>
            <col id="song-title-column"/>
            <col id="song-duration-column"/>
          </colgroup>
            <tbody>
              {
                this.state.album.songs.map( (song, index) =>
                   <tr className="song" key={index} onClick={() => this.handleSongClick(song)} onMouseEnter = {() => this.hover(song)} onMouseLeave = {() => this.unHover(song)}>
                    <td>{this.songButtons(song, index)}</td>
                    <td className="song-titles">{song.title}</td>
                    <td className="song-duration">{song.duration} sec</td>
                  </tr>
                )
              }
            </tbody>
        </table>
         <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={() => this.formatTime(this.audioElement.currentTime)}
           duration={this.audioElement.duration}
           currentVolume={this.audioElement.volume}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleForwClick={() => this.handleForwClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
         />

       </section>
     );
   }
 }

export default Album;
