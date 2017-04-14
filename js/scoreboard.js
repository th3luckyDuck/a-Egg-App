function properties(obj) {
  return _(obj).toPairs().map(([key, value]) => `${key}: ${value}`)
}
AFRAME.registerComponent('scoreboard', {
  dependencies: ['sync'],
  schema: {
    on: {type: 'string'},
    filter: {type: 'string'},
    max: {type: 'number'}
  },
  init: function () {
    this.syncSys = this.el.components.sync.syncSys;
    if (this.syncSys.isConnected) {
      this.setup();
    }
    else {
      this.el.sceneEl.addEventListener('connected', this.setup.bind(this));
    }
  },
  setup() {
    var dataRef = this.el.components.sync.dataRef;
    this.userId = this.syncSys.userInfo.userId;
    var userRef = dataRef.child('users').child(this.userId);

    userRef.child('displayName').set(this.syncSys.userInfo.displayName);

    this.score = userRef.child('score');

    document.body.addEventListener(this.data.on, this.incrementScore.bind(this));
    dataRef.child('users').on('value', this.renderScores.bind(this));
  },
  incrementScore: function (event) {
    if (!event.target.matches(this.data.filter)) { return; }
    this.score.transaction((val) => val + 1);
  },
  renderScores: function (snapshot) {
    var users = snapshot.val();
    var sortedUsers = _(users).values().filter('score').sortBy('score').reverse().take(20).value();
    // TODO: Do something nicer with people who reach the max score. E.g. display a golden egg!
    var myScore = Math.min(users[this.userId].score || '', this.data.max);
    // TODO: Make this look pretty
    ReactDOM.render(
      <a-entity>
        <a-entity n-text={properties({text: myScore})} position="-0.81 0.405 -1.75" rotation="-25 0 0" scale="0.15 0.15 0.03" n-cockpit-parent></a-entity>
        {sortedUsers.map((user, i) =>
          <a-entity position='1.5 -0 -9.5' rotation="0 15 0" scale='0.2 0.2 0.2'>
            <a-entity n-text={properties({text: user.displayName})} position={`0 ${-i} 0`}></a-entity>
            <a-entity n-text={properties({text: Math.min(user.score, this.data.max)})} position={`4 ${-i} 0`}></a-entity>
          </a-entity>
        )}
      </a-entity>,
      this.el
    );
  }
});
