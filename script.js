let current_song = new Audio();
let previousSelected = null;
let songs;
let currFolder
async function get_songs(folder) {
    let a = await fetch(`${folder}/`) // Changing
    // console.log(a);
    currFolder = folder;
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let wrapper = div.querySelector('#wrapper');
    let as = wrapper.querySelectorAll('.icon-default');
    songs = []
    for (let as_filter = 0; as_filter < as.length; as_filter++) {
        songs.push(as[as_filter].href.split(`/${folder}/`)[1]);
    }

    let songsUL = document.querySelector('.songs_list').querySelector('ul');
    songsUL.innerHTML = '';
    console.log(songsUL);
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li class="song_li">
        <div class="library_li_info">
        <img src="svg/images/music.png" alt="" class="img1"> 
        <div class="info">
        <div class="song_name">${song.replaceAll("%20", " ")}</div>
        <div class="artist_name">Shashank</div>
        </div>
        </div>
        <img src="svg/playbtn.svg" alt="img2" class="img2 play_img" />
        </li>`
    }


    Array.from(document.querySelector('.songs_list').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', Element => {
            console.log(e.querySelector('.info').firstElementChild.innerHTML);
            PlayMusic(e.querySelector('.info').firstElementChild.innerHTML);

            if (previousSelected) {
                previousSelected.classList.remove('highlighted'); // Remove class from the previous song
            }
            e.classList.add('highlighted');
            previousSelected = e;
        })
    })
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Ensure two-digit format using padStart
    let formattedMinutes = minutes.toString().padStart(2, '0');
    let formattedSeconds = secs.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


const PlayMusic = (track, pause = false) => {
    // let audio = new Audio()
    current_song.src = `/${currFolder}/` + track;
    if (!pause) {
        current_song.play();
        play.src = 'svg/images/play.svg'
    }
    // current_song.play();
    document.querySelector('.song-info').innerHTML = decodeURI(track).split('.mp3')[0]
    console.log(decodeURI(track));
    
    document.querySelector('.timeline').innerHTML = '00:00 / 00:00'


}

async function display_folder() {
    let a = await fetch(`songs/`)
    let response = await a.text();
    // console.log(response);
    let div1 = document.createElement('div');
    div1.innerHTML = response;
    let as = div1.getElementsByTagName('a')
    console.log(as);
  let array =   Array.from(as)
        
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
      

        if (e.href.includes('/songs/')) {
            let folder = (e.href.split('/')[4]);
            let a = await fetch(`songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response);
            let cardContainer = document.querySelector('.cardContainer')
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div class="card" data-folder="${folder}">
                <div class="play_btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 44 44"
                    width="40"
                    height="40"
                  >
                    <!-- Updated green circle as the background -->
                    <circle cx="22" cy="22" r="22" fill="rgb(3, 255, 61)" />
                    <!-- Original SVG icon, scaled and centered -->
                    <g transform="translate(10, 10)">
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                        fill="none"
                      />
                    </g>
                  </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="card-img" />
                <h2>${response.title}</h2>
                <p>${response.description}</p>
              </div>`

        }

        
        
        
    }
    // console.log(typeof(document.getElementsByClassName('card')));
   Array.from(document.getElementsByClassName('card')).forEach(e=>{
    console.log(e);
    
    e.addEventListener("click", async item=>{
        songs = await get_songs(`songs/${item.currentTarget.dataset.folder}`)
    })
   })

    
        


}

async function main() {
    await get_songs('songs/1');
    // console.log(songs);
    PlayMusic(songs[0], true)

    //  Display all the albums  
    display_folder();

    play.addEventListener('click', () => {
        console.log('clicked');
        if (current_song.paused) {
            current_song.play();
            play.src = 'svg/images/play.svg'

        } else {
            play.src = 'svg/playbtn.svg'
            current_song.pause()
        }

    })
    
    
        
    //  listen for timeupdate event 
    current_song.addEventListener("timeupdate", () => {
        // console.log(current_song.currentTime, current_song.duration);
        document.querySelector(".timeline").innerHTML = `${formatTime(current_song.currentTime)}  /  ${formatTime(current_song.duration)}`

        document.querySelector('.circle').style.left = (current_song.currentTime / current_song.duration) * 100 + '%'

        //    document.querySelector('#line').style.width =  (current_song.currentTime / current_song.duration) * 100 + '%'
    })


    document.querySelector('.seekbar').addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        document.querySelector('.circle').style.left = percent + '%';
        // document.querySelector('#line').style.width = percent + '%';
        current_song.currentTime = ((current_song.duration) * percent) / 100


    })

    // Hamburger working logic
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0%'


    })

    document.querySelector('.ham_close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-100%'
    })

    // Logic for previous and next song button
    // Logic for previous and next song button
    previous.addEventListener('click', () => {

        let index = songs.indexOf(current_song.src.split('/songs/')[1]);
        // console.log(index);
        if (index > 0) {
            PlayMusic(songs[index - 1]);
        }
    });

    next.addEventListener('click', () => {
        // console.log('next clicked');
        let index = songs.indexOf(current_song.src.split('/songs/')[1]);
        // console.log(index);

        if (index < songs.length - 1) {
            PlayMusic(songs[index + 1]);
        }

    });

    // add an evetn listener to vol btn
    document.querySelector('.vol_range').getElementsByTagName('input')[0].addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value);
        current_song.volume = (e.target.value) / 100;
        console.log(current_song.volume);


    })
 
}

main();

console.log("jelly");
