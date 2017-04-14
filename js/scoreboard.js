AFRAME.registerComponent('scoreboard', {
  dependencies: ['sync'],
  schema: {
    on: {type: 'string'},
    filter: {type: 'string'}
  },
	init: function () {
    var syncSys = this.el.components.sync.syncSys;
    var dataRef = this.el.components.sync.dataRef;
    var userRef = dataRef.child('users').child(syncSys.userInfo.userId)

    userRef.child('info').set({
      userId: syncSys.userInfo.userId,
      displayName: syncSys.userInfo.displayName,
    });

    this.score = userRef.child('score');

    document.body.addEventListener(this.data.on, this.incrementScore.bind(this));
    dataRef.child('users').on('value', this.renderScores.bind(this));
	},
  incrementScore: function (event) {
    if (!event.target.matches(this.data.filter)) { return; }
    this.score.transaction(function (val) {
      return val + 1;
    });
  },
  renderScores: function (snapshot) {
    var val = snapshot.val();
    console.log(JSON.stringify(val));
  }
});
