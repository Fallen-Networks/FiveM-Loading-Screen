// From synn-loadscreen (https://github.com/vecchiotom/synn-loadscreen/blob/master/js/music-handler.js)
var np = document.getElementById("now-playing");

var lib ={
    rand: function(min, max)
        {
            return min + Math.floor(Math.random()*max);
        }
}

var music ={
    list:
    [
        "AINGJmnwMic", "sT_VcU_jOEM", "PVfjOjiBUkc", "vWdjWYhEONA",
        "HcJHr_8i-PY", "HCXW-Wbfn4U", "E1nBw1IwCI8", "wzAq_wbVT9A",
        "KeuPv9lN6zI", "IEZ6JHezCAw", "kGh7spYm2fs", "wLo2RvLU57c",
        "NYuhye3AYSY", "u3xqpu7v8jU", "UTBuH5ZNnJQ", "vWdjWYhEONA",
        "FYW1Y4EEA2Y", "E-4Dtd6mC-c", "zQnj66Xuajs", "8OgHDck_vT0",
        "kUdCNdd9n28", "qDUH3PUoYtw", "SoMeB4QBVug", "8sV6AT6jVuI"
    ]
}

var playing = true;

function onKeyDown(event) {
    switch (event.keyCode) {
        case 32: //SpaceBar
            if (playing) {
                    pause();
                    playing = false;
                } else {
                    resume();
                    playing = true;
                }
            break;
        }
    return false;
}

window.addEventListener("keydown", onKeyDown, false);


if('true')
{
    setInterval(UpdateMusicInfo, 1000);
}
else
{
    container.style.display = "none";
}

function UpdateMusicInfo()
{

    if(title.length != 0)
    {
        np.innerHTML = "Now Playing: " + title;
    }
    else
    {
        np.innerHTML = "Now Playing: n.a.";
    }
}

//YouTube IFrame API player.
var player;

if('true')
{
    //Create DOM elements for the player.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    var ytScript = document.getElementsByTagName('script')[0];
    ytScript.parentNode.insertBefore(tag, ytScript);

    //Pick random index to start at.
    var musicIndex = lib.rand(0, music.list.length);
    var title = "n.a.";
}

function onYouTubeIframeAPIReady() 
{
    var videoId = music.list[musicIndex];

    player = new YT.Player('player', {
        width: '600',
        height: '600',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'disablekb': 0,
            'enablejsapi': 1,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError 
        }
    });
}

function onPlayerReady(event) 
{
    title = event.target.getVideoData().title;
    player.setVolume('15');

    play();
}

function onPlayerStateChange(event) 
{
    if(event.data == YT.PlayerState.PLAYING)
    {
        title = event.target.getVideoData().title;
    }

    if (event.data == YT.PlayerState.ENDED) 
    {
        musicIndex++;
        play();
    }
}

function onPlayerError(event)
{
    switch (event.data) 
    {
        case 2:
            console.log("Invalid video url!");
            break;
        case 5:
            console.log("HTML 5 player error!");
        case 100:
            console.log("Video not found!");
        case 101:
        case 150:
            console.log("Video embedding not allowed.");
            break;
        default:
            console.log("Looks like you got an error bud.")
    }

    skip();
}

function skip()
{
    musicIndex++;
    play();
}
function back()
{
    musicIndex--;
    play();
}

function play()
{
    title = "n.a.";

    var idx = musicIndex % music.list.length;
    var videoId = music.list[idx];

    console.log("Playing next.. id: " + idx + " vid:" + videoId);

    player.loadVideoById(videoId, 0, "tiny");
    player.playVideo();
}

function resume()
{
    player.playVideo();
}

function pause() 
{
    player.pauseVideo();
}

function stop() 
{
    player.stopVideo();
}

function setVolume(volume)
{
    player.setVolume(volume)
}