let musics;
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");
let musicLibrary = document.querySelector(".vertical-menu");
let recentlyPlayed = document.querySelector(".recentlyPlayed");
let nextSongs = document.querySelector(".nextSongs");
 
let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
 
let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
 

let songIndex = 0;
let isPlaying = false;
let updateTimer;

let curr_music = document.createElement('audio');

function loadTrack(songIndex){                     //make sure you find the best index via nextTrack and prevTrack functions
    clearInterval(updateTimer);
    resetValue();                                  
    curr_music.src = upcomiSongs[songIndex];
    curr_music.load();

    track_name.textContent = upcomiSongs[songIndex].name;
    track_artist.textContent = upcomiSongs[songIndex].artist;
    track_art = upcomiSongs[songIndex].cover;

    updateTimer = setInterval(seekUpdate, 1000);

    curr_music.addEventListener("ended", addToRecent);
    curr_music.addEventListener("ended", nextTrack);
}

function resetValue(){
    curr_time = "00:00";
    total_duration = "00:00";
    seek_slider.value = 0;
}

function seekUpdate(){
    let seekposition = 0;

    if(!isNaN(curr_music.duration)){
        seekposition = curr_music.currentTime * (100/curr_music.duration);
        seek_slider.value = seekposition;

        let currentMin = Math.floor(curr_music.currentTime / 60);
        let currentSec = Math.floor(curr_music.currentTime - 60 * currentMin);
        let totalMin = Math.floor(curr_music.duration / 60);
        let totalSec = Math.floor(curr_music.duration - 60 * totalMin);

        if(currentMin < 10){currentMin = "0" + currentMin};
        if(currentSec < 10){currentSec = "0" + currentSec};
        if(totalMin < 10){totalMin = "0" + totalMin};
        if(totalSec < 10){totalSec = "0" + totalSec};

        curr_time.textContent = currentMin + ":" + currentSec;
        total_duration.textContent = totalMin + ":" + totalSec;
    }
}

let recent = [];
function addToRecent(){
    recent.push(curr_music.title);
    const parent2 = document.createElement('div');
    const div2 = document.createElement('div');
    parent2.className = 'recentlyPlayed';
    div2.appendChild(document.createTextNode(curr_music.title));
    parent2.appendChild(div2);
    recentlyPlayed.appendChild(parent2);
}

function nextTrack(){
    if(songIndex != rear - 1)
        songIndex = songIndex + 1;
    else
        songIndex = 0;
    loadTrack(songIndex);
    playTrack();
}

function prevTrack(){
    if(songIndex == 0)
        songIndex = rear - 1;
    else
        songIndex = songIndex - 1;
        
    loadTrack(songIndex);
    playTrack();
}

function playPauseTrack(){
    if(isPlaying){
        curr_music.pause();
        isPlaying = false;
        playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
    }

    else{
        curr_music.play();
        isPlaying = true;
        playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
    }
}

let track_library = [];

function getMusics() {
    fetch('http://localhost:3000/songs').then((res) => res.json()).then((allMusics) => {
        musics = new Map(Object.entries(allMusics));
        for (const [key, value] of musics.entries()) {
            const parent = document.createElement('div');
            const div = document.createElement('div');
            parent.className = 'vertical-menu-div';
            div.appendChild(document.createTextNode(value.title));
            parent.appendChild(div);
            musicLibrary.appendChild(parent);
            track_library.push(value);//adding tracks to an array
        }
    })
}

let upcomiSongs = [];//a que for saving the upcomig songs
let front = 0;//the first elemnt of the afformentioned que
let rear = 0;//the last element of the afformentioned que

function firstAddToQue(){
    upcomiSongs = upcomiSongs.concat(track_library);//adding the loaded songs to the que
    rear = (track_library.length);

    for(let i = 0; i < upcomiSongs.length; i++){
        const parent3 = document.createElement("div");
        const div3 = document.createElement("div");
        parent3.className = 'nextSongs';
        div3.appendChild(createTextNode(upcomiSongs[i].title + " - " + upcomiSongs[i].artist));
        parent3.appendChild(div3);
        nextSongs.appendChild(parent3);
    }
}

(() =>{
    getMusics();//loading files
    firstAddToQue();
    loadTrack(songIndex);
    playpause_btn.addEventListener("click", playPauseTrack);
    next_btn.addEventListener("click", nextTrack);
    prev_btn.addEventListener("click",prevTrack);
})();