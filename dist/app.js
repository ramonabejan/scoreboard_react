"use strict";

var PLAYERS = [{
  name: "Jim Hoskins",
  score: 31,
  id: 1
}, {
  name: "Andrew Chalkley",
  score: 35,
  id: 2
}, {
  name: "Alena Holligan",
  score: 42,
  id: 3
}];
var nextId = 4;

var AddPlayerForm = React.createClass({
  displayName: "AddPlayerForm",

  propTypes: {
    onAdd: React.PropTypes.func.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      name: ""
    };
  },

  onNameChange: function onNameChange(e) {
    this.setState({ name: e.target.value });
  },

  onSubmit: function onSubmit(e) {
    e.preventDefault();

    this.props.onAdd(this.state.name);
    this.setState({ name: "" });
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "add-player-form" },
      React.createElement(
        "form",
        { onSubmit: this.onSubmit },
        React.createElement("input", { type: "text", value: this.state.name, onChange: this.onNameChange }),
        React.createElement("input", { type: "submit", value: "Add Player" })
      )
    );
  }
});

function Stats(props) {
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function (total, player) {
    return total + player.score;
  }, 0);

  return React.createElement(
    "table",
    { className: "stats" },
    React.createElement(
      "tbody",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          null,
          "Players:"
        ),
        React.createElement(
          "td",
          null,
          totalPlayers
        )
      ),
      React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          null,
          "Total Points:"
        ),
        React.createElement(
          "td",
          null,
          totalPoints
        )
      )
    )
  );
}

Stats.propTypes = {
  players: React.PropTypes.array.isRequired
};

function Header(props) {
  return React.createElement(
    "div",
    { className: "header" },
    React.createElement(Stats, { players: props.players }),
    React.createElement(
      "h1",
      null,
      props.title
    )
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired
};

function Counter(props) {
  return React.createElement(
    "div",
    { className: "counter" },
    React.createElement(
      "button",
      { className: "counter-action decrement", onClick: function onClick() {
          props.onChange(-1);
        } },
      " - "
    ),
    React.createElement(
      "div",
      { className: "counter-score" },
      " ",
      props.score,
      " "
    ),
    React.createElement(
      "button",
      { className: "counter-action increment", onClick: function onClick() {
          props.onChange(1);
        } },
      " + "
    )
  );
}

Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
};

function Player(props) {
  return React.createElement(
    "div",
    { className: "player" },
    React.createElement(
      "div",
      { className: "player-name" },
      React.createElement(
        "a",
        { className: "remove-player", onClick: props.onRemove },
        "\u2716"
      ),
      props.name
    ),
    React.createElement(
      "div",
      { className: "player-score" },
      React.createElement(Counter, { score: props.score, onChange: props.onScoreChange })
    )
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired
};

var Application = React.createClass({
  displayName: "Application",

  propTypes: {
    title: React.PropTypes.string,
    initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      score: React.PropTypes.number.isRequired,
      id: React.PropTypes.number.isRequired
    })).isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      title: "Scoreboard"
    };
  },

  getInitialState: function getInitialState() {
    return {
      players: this.props.initialPlayers
    };
  },

  onScoreChange: function onScoreChange(index, delta) {
    this.state.players[index].score += delta;
    this.setState(this.state);
  },

  onPlayerAdd: function onPlayerAdd(name) {
    this.state.players.push({
      name: name,
      score: 0,
      id: nextId
    });
    this.setState(this.state);
    nextId += 1;
  },

  onRemovePlayer: function onRemovePlayer(index) {
    this.state.players.splice(index, 1);
    this.setState(this.state);
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "scoreboard" },
      React.createElement(Header, { title: this.props.title, players: this.state.players }),
      React.createElement(
        "div",
        { className: "players" },
        this.state.players.map(function (player, index) {
          return React.createElement(Player, {
            onScoreChange: function (delta) {
              this.onScoreChange(index, delta);
            }.bind(this),
            onRemove: function () {
              this.onRemovePlayer(index);
            }.bind(this),
            name: player.name,
            score: player.score,
            key: player.id });
        }.bind(this))
      ),
      React.createElement(AddPlayerForm, { onAdd: this.onPlayerAdd })
    );
  }
});

ReactDOM.render(React.createElement(Application, { initialPlayers: PLAYERS }), document.getElementById('container'));