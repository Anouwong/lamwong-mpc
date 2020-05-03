const log = require('fancy-log'),
    jsdom = require('jsdom'),
    config = require('./config'),
    { JSDOM } = jsdom;

// Discord Rich Presence has a string length limit of 128 characters.
// This little plugin (based on https://stackoverflow.com/a/43006978/7090367)
// helps by trimming strings up to a given length.
String.prototype.trimStr = function (length) {
    return this.length > length ? this.substring(0, length - 3) + "..." : this;
};

// Defines playback data fetched from MPC.
let playback = {
    filename: '',
    position: '',
    duration: '',
    fileSize: '',
    state: '',
    prevState: '',
    prevPosition: '',
};

/**
 * Sends Rich Presence updates to Discord client.
 * @param {SnekfetchResponse} res Response from MPC Web Interface variables page
 * @param {RPCClient} rpc Discord Client RPC connection instance
 */
const updatePresence = (res, rpc) => {
    // Identifies which MPC fork is running.
    const mpcFork = res.headers.server.replace(' WebServer', '');

    // Gets a DOM object based on MPC Web Interface variables page.
    const { document } = new JSDOM(res.body).window;

    // Gets relevant info from the DOM object.
    let filename = playback.filename = document.getElementById('filepath').textContent.split("\\").pop().trimStr(128);
    playback.state = document.getElementById('state').textContent;
    playback.duration = sanitizeTime(document.getElementById('durationstring').textContent);
    playback.durationMS = document.getElementById('duration').textContent;
    playback.position = sanitizeTime(document.getElementById('positionstring').textContent);
    playback.positionMS = document.getElementById('position').textContent;
    playback.volume = document.getElementById('volumelevel').textContent

    var durationPercent = playback.positionMS*100/playback.durationMS;

    let type = playback.filename.split('.').slice(-1).join();
  	var videoFileFormat = ['webm','mkv','ts','mp4','m4p','3gp','3g2','flv'];
  	var audioFileFormat = ['mp3','ac','m4a','m4b','mpc','ogg','opus','raw','wav','wma'];

    let play_pic;
    let play_str;
    let pause_pic;
    let pause_str;
    let stop_pic;
    let stop_str;
    let unknownfile_pic;
    let unknownfile_str;

    if(videoFileFormat.includes(type)){
      play_str = 'วีดีโอ - กำลังเล่น';
      play_pic = 'mv_play';
      pause_str = 'วีดีโอ - หยุดชั่วคราว';
      pause_pic = 'mv_pause';
      stop_str = 'วีดีโอ - หยุดแล้ว';
      stop_pic = 'mv_stop';
    } else if(audioFileFormat.includes(type)){
      play_str = 'เพลง - กำลังเล่น';
      play_pic = 'm_play';
      pause_str = 'เพลง - หยุดชั่วคราว';
      pause_pic = 'm_pause';
      stop_str = 'เพลง - หยุดแล้ว';
      stop_pic = 'm_stop';
    } else {
      play_str = 'ไฟล์ไม่รู้จัก';
      play_pic = 'question';
      pause_pic = 'ไฟล์ไม่รู้จัก';
      pause_str = 'question';
      stop_pic = 'ไฟล์ไม่รู้จัก';
      stop_str = 'question';
    }

    // Defines strings and image keys according to the 'state' string
    // provided by MPC.
    const states = {
      '-1': {
          string: 'ไม่ว่าง',
          stateKey: stop_pic
  		// stateKey: 'stop_small'
      },
      '0': {
          string: stop_str,
          stateKey: stop_pic
  		// stateKey: 'stop_small'
      },
      '1': {
          string: pause_str,
          stateKey: pause_pic
  		// stateKey: 'pause_small'
      },
      '2': {
          string: play_str,
          stateKey: play_pic
  		// stateKey: 'play_small'
      }
    };

    var speaker_total = {
      '0' : "🔇",
      '1-33' : "🔈",
      '33-55' : "🔉",
      '55-90' : "🔊",
      '90-100' : "🤯"
    }

	var speaker_emoji;
	if (playback.volume > 89) speaker_emoji = speaker_total['90-100'];
	else if (playback.volume > 54) speaker_emoji = speaker_total['55-90'];
	else if (playback.volume > 32) speaker_emoji = speaker_total['33-55'];
	else if (playback.volume > 1) speaker_emoji = speaker_total['1-33'];
	else speaker_emoji = speaker_total['0'];

    // Replaces underscore characters to space characters
    if (config.replaceUnderscore) playback.filename = playback.filename.replace(/_/g, " ");

    // Removes brackets and its content from filename if `ignoreBrackets` option
    // is set to true
    if (config.ignoreBrackets) {
        playback.filename = playback.filename.replace(/ *\[[^\]]*\]/g, "").trimStr(128);
        if (playback.filename.substr(0, playback.filename.lastIndexOf(".")).length == 0) playback.filename = filename;
    }
	
	// Replaces dots in filenames to space characters
    // Solution found at https://stackoverflow.com/a/28673744
    if (config.replaceDots) {
        playback.filename = playback.filename.replace(/[.](?=.*[.])/g, " ");
    }

	// Removes filetype from displaying
	if (config.ignoreFiletype) playback.filename = playback.filename.substr(0, playback.filename.lastIndexOf("."));

    // Prepares playback data for Discord Rich Presence.
    let payload = {
        state: 'เวลา: ' + playback.duration + ' น. (🔴: '+durationPercent.toFixed(1)+'%) ('+speaker_emoji+': ' + playback.volume + '%) ',
        startTimestamp: undefined,
        endTimestamp: undefined,
        details: playback.filename,
        largeImageKey: states[playback.state].stateKey,
        largeImageText: states[playback.state].string,
        smallImageKey: mpcFork === 'MPC-BE' ? 'mpc_be' : 'mpc_hc',
        smallImageText: mpcFork,
    };

    // Makes changes to payload data according to playback state.
    switch (playback.state) {
        case '-1': // Idling
            payload.state = states[playback.state].string;
            payload.details = undefined;
            break;
        case '1': // Paused
            payload.details = playback.filename;
            payload.state = '[ '+ playback.position +' น. / ' + playback.duration + ' น. ] (🔴: '+durationPercent.toFixed(1)+'%) ('+speaker_emoji+': ' + playback.volume + '%)';
            break;
        case '2': // Playing
            if (config.showRemainingTime) {
                payload.endTimestamp = Date.now() + (convert(playback.duration) - convert(playback.position));
            } else {
                payload.startTimestamp = Date.now() - convert(playback.position);
            }
            break;
    }

    // Only sends presence updates if playback state changes or if playback position
    // changes while playing.
    if ((playback.state !== playback.prevState) || (
        playback.state === '2' &&
        convert(playback.position) !== convert(playback.prevPosition) + 5000
    )) {
        rpc.setActivity(payload)
            .catch((err) => {
                log.error('ERROR: ' + err);
            });
        log.info('INFO: Presence update sent: ' +
            `${states[playback.state].string} - ${playback.position} / ${playback.duration} - ${playback.filename}`
        );
    }

    // Replaces previous playback state and position for later comparison.
    playback.prevState = playback.state;
    playback.prevPosition = playback.position;
    return true;
};

/**
 * Simple and quick utility to convert time from 'hh:mm:ss' format to milliseconds.
 * @param {string} time Time string formatted as 'hh:mm:ss'
 * @returns {number} Number of milliseconds converted from the given time string
 */
const convert = time => {
    let parts = time.split(':'),
        seconds = parseInt(parts[parts.length - 1]),
        minutes = parseInt(parts[parts.length - 2]),
        hours = (parts.length > 2) ? parseInt(parts[0]) : 0;
    return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
};

/**
 * In case the given 'hh:mm:ss' formatted time string is less than 1 hour,
 * removes the '00' hours from it.
 * @param {string} time Time string formatted as 'hh:mm:ss'
 * @returns {string} Time string without '00' hours
 */
const sanitizeTime = time => {
    if (time.split(':')[0] === '00') {
        return time.substr(3, time.length - 1);
    }
    return time;
};

module.exports = updatePresence;
