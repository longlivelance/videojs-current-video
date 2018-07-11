import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-current-video', {

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.expect(1);

  assert.strictEqual(
    typeof Player.prototype.currentVideo,
    'function',
    'videojs-current-video plugin was registered'
  );

  this.player.currentVideo();
});

QUnit.test('setCurrentVideo function is present and working as expected', function(assert) {
  assert.expect(4);

  assert.strictEqual(
    typeof plugin.prototype.setCurrentVideo,
    'function',
    'setCurrentVideo is a function'
  );

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.strictEqual(
    this.player.currentVideo().setCurrentVideo(),
    false,
    'setCurrentVideo returns false if a video is not passed in.'
  );
  assert.strictEqual(
    this.player.currentVideo().setCurrentVideo({}),
    false,
    'setCurrentVideo returns true if a video is passed in and successfully set.'
  );
  assert.strictEqual(
    this.player.currentVideo().setCurrentVideo({title:'Test Title'}),
    true,
    'setCurrentVideo returns false if an empty video is not passed in.'
  );
});

QUnit.test('getCurrentVideo function is present and working as expected', function(assert) {
  assert.expect(2);

  assert.strictEqual(
    typeof plugin.prototype.getCurrentVideo,
    'function',
    'getCurrentVideo is a function'
  );

  this.player.currentVideo().setCurrentVideo({title:'Test Title'})
  
  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.strictEqual(
    this.player.currentVideo().getCurrentVideo(),
    {title: 'Test Title'},
    'getCurrentVideo returns te current video.'
  );
});
