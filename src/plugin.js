import videojs from 'video.js';
import {version as VERSION} from '../package.json';

import empty from 'is-empty';

const Plugin = videojs.getPlugin('plugin');

class currentVideo extends Plugin {

  constructor(player, options) {
    super(player, options);

    console.log('CURRENT VIDEO!');

    const defaults = {
      currentVideo: false
    };

    this.options = videojs.mergeOptions(defaults, options);
    this.videos = [];

    player.one('ready', () => {
      if (this.options.currentVideo) {
        this.setCurrentVideo(this.options.currentVideo);
      }
    });
  }

  /**
   * Function to used to set the next current video.

   * @function setCurrentVideo
   * @param    {Object} [video={}]
   *           A plain object representing the metadata of the current video.
   *
   * @return  {Boolean}
   *          True if a new video was set, false if one was not.
   */
  setCurrentVideo(video) {
    if (empty(video)) {
      videojs.log.warn('setCurrentVideo requires that a non empty object be passed.')
      return false;
    }

    videojs.log(video);
    this.videos.push(video);

    this.trigger('current-video-updated', video);

    return true;
  }

  /**
   * Function to invoke when the player is ready.
   *
   * This is a great place for your plugin to initialize itself. When this
   * function is called, the player will have its DOM and child components
   * in place.
   *
   * @function getCurrentVideo
   * @return  {Object|Boolean}
   *          Returns the current video or false if one is not set..
   */
  getCurrentVideo() {
    if (empty(this.videos[this.videos.length - 1])) {
      videojs.log('There is no current video set.');
      return false;
    }
    return this.videos[this.videos.length - 1];
  }
}

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;
console.log('PLUGIN FILE LOADED');
// Register the plugin with video.js.
registerPlugin('currentVideo2', currentVideo);

// Include the version number.
currentVideo.VERSION = VERSION;

export default currentVideo;
