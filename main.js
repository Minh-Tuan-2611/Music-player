const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var heading = $('header h2');
var cdThumb = $('.cd-thumb');
var audio = $('#audio');
var cd = $('.cd');
var playBtn = $('.btn-toggle-play');
var player = $('.player');
var progress = $('#progress');
var nextBtn = $('.btn-next');
var prevBtn = $('.btn-prev');
var randomBtn = $('.btn-random');
var repeatBtn = $('.btn-repeat');
var playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRadom: false,
    isRepeat: false,

    songs: [{
            name: "Nevanda",
            singer: "Vicetone, Cozi Zuehlsdorff ",
            path: "./Nevada - Vicetone, Cozi Zuehlsdorff.mp3",
            image: "./img/nevada.jpg"
        },
        {
            name: "Thunder",
            singer: "Gabry Ponte, LUM!X, Prezioso ",
            path: "./Thunder-NightcoreGabryPonteLUMXPrezioso-7052550.mp3",
            image: "./img/thunder.jpg"
        },
        {
            name: "Attention",
            singer: "Charlie Puth",
            path: "./Attention - Charlie Puth.mp3",
            image: "./img/attention.jpg"
        },
        {
            name: "One Call Away",
            singer: "Charlie Puth",
            path: "./TaiNhacHay.Biz - One Call Away.mp3",
            image: "./img/one call away.jpg"
        },
        {
            name: "Walk Thru Fire",
            singer: "Vicetone, MeronRyan",
            path: "./WalkThruFire-VicetoneMeronRyan-5573260.mp3",
            image: "./img/walk.jpg"
        },
        {
            name: "Don't Start Now",
            singer: "Dua Lipa",
            path: "./DonTStartNow-DuaLipa-6299636.mp3",
            image: "./img/dont start now.jpg"
        },
        {
            name: "Summer Time",
            singer: "Maggie, Nyan",
            path: "./Summertime-CinnamonsEveningCinema-6046288.mp3",
            image: "./img/summer time.jpg"
        },
        {
            name: "Scared To Be Lonely",
            singer: "Martin Garrix",
            path: "./TaiNhacMienPhi.Net - Scared To Be Lonely.mp3",
            image: "./img/scared.jpg"
        },
        {
            name: "Stay",
            singer: "Zedd, Alessia Cara",
            path: "./Stay-ZeddAlessiaCara-4905772.mp3",
            image: "./img/stay.jpg"
        },
        {
            name: "The Ocean",
            singer: "Mike Perry",
            path: "./TheOcean-NightcoreMikePerryShyMartin-6803992.mp3",
            image: "./img/ocean.jpg"
        },
    ],

    render: function() {
        var htmls = this.songs.map(function(song, index) {
            return `
            <div class="song ${index===app.currentIndex? 'active':''}" data-index = ${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join(' ');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvent: function() {
        var cdWidth = cd.offsetWidth;

        // X??? l?? CD quay v?? d???ng
        var cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // X??? l?? ph??ng to, thu nh??? cd
        document.onscroll = function() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // X??? l?? khi click play 
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // X??? l?? khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function() {
            if (audio.duration) {
                var progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // X??? l?? khi tua song
        progress.onchange = function(event) {
            var seekTime = audio.duration / 100 * event.target.value;
            audio.currentTime = seekTime;
        }

        // X??? l?? khi click song k??? ti???p
        nextBtn.onclick = function() {
            if (app.isRadom) {
                app.playRadomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // X??? l?? khi click song tr?????c
        prevBtn.onclick = function() {
            if (app.isRadom) {
                app.playRadomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // X??? l?? khi click song random
        randomBtn.onclick = function() {
            app.isRadom = !app.isRadom;
            app.isRepeat = false;
            randomBtn.classList.toggle('active', app.isRadom);
            repeatBtn.classList.remove('active');
        }

        // X??? l?? khi click l???p b??i h??t
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat;
            app.isRadom = false;
            repeatBtn.classList.toggle('active', app.isRepeat);
            randomBtn.classList.remove('active');
        }

        // X??? l?? khi audio k???t th??c
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play();
            } else {
                if (app.isRadom) {
                    app.playRadomSong();
                } else {
                    app.nextSong();
                }
                audio.play();
            }
        }

        // X??? l?? khi click v??o play list
        playlist.onclick = function(e) {
            var songNode = e.target.closest('.song:not(.active)')
            if (songNode) {
                app.currentIndex = Number(songNode.getAttribute('data-index'));
                app.loadCurrentSong();
                app.render();
                audio.play();
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRadomSong: function() {
        do {
            var newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        this.scrollToActiveSong();
        this.render();
    },

    start: function() {
        this.defineProperties();

        this.handleEvent();

        this.loadCurrentSong();

        this.render();
    }
}

app.start()