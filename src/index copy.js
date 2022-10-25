import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: new Array(9).fill(undefined),
      history: [],
      turnFlag: 1,

      // ingame
      size: 3,
      conditionalWinner: 3,
      winner: undefined,
    };
  }

  convertIndex(index) {
    return {
      i: Math.floor(index / this.state.size),
      j: index % this.state.size,
    };
  }

  reverseIndex(i, j) {
    return i * this.state.size + j;
  }

  //vertical
  checkVerticalWinner(squares, latestIdx) {
    let path = [];

    let coord = this.convertIndex(latestIdx);

    let currentI = coord.i;
    let currentJ = coord.j;

    while (true) {
      currentI -= 1;

      if (currentI < 0) break;

      let index = this.reverseIndex(currentI, currentJ);
      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }

    if (path.length + 1 === this.state.conditionalWinner) return path;
    currentI = coord.i;

    while (true) {
      currentI += 1;

      if (currentI >= this.state.size) break;

      let index = this.reverseIndex(currentI, currentJ);
      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }
    if (path.length + 1 === this.state.conditionalWinner) return path;
  }

  //horizontal
  checkHorizontalWinner(squares, latestIdx) {
    let path = [];

    let coord = this.convertIndex(latestIdx);

    let currentI = coord.i;
    let currentJ = coord.j;

    while (true) {
      currentJ -= 1;

      if (currentJ < 0) break;

      let index = this.reverseIndex(currentI, currentJ);
      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }

    if (path.length + 1 === this.state.conditionalWinner) return path;
    currentJ = coord.j;

    while (true) {
      currentJ += 1;

      if (currentJ >= this.state.size) break;

      let index = this.reverseIndex(currentI, currentJ);
      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }
    if (path.length + 1 === this.state.conditionalWinner) return path;
  }

  //diagonalLeft
  checkdiagonalLefWinner(squares, latestIdx) {
    let path = [];

    let coord = this.convertIndex(latestIdx);

    let currentI = coord.i;
    let currentJ = coord.j;

    while (true) {
      currentI -= 1;
      currentJ -= 1;

      if (currentI < 0 || currentJ < 0) break;

      let index = this.reverseIndex(currentI, currentJ);

      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }

    if (path.length + 1 === this.state.conditionalWinner) return path;
    currentI = coord.i;
    currentJ = coord.j;

    while (true) {
      currentI += 1;
      currentJ += 1;

      if (currentI >= this.state.size || currentJ >= this.state.size) break;

      let index = this.reverseIndex(currentI, currentJ);

      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }
    if (path.length + 1 === this.state.conditionalWinner) return path;
  }
  //diagonalRight
  checkDiagonalRightWinner(squares, latestIdx) {
    let path = [];

    let coord = this.convertIndex(latestIdx);

    let currentI = coord.i;
    let currentJ = coord.j;

    while (true) {
      currentI -= 1;
      currentJ += 1;

      if (currentI < 0 || currentJ >= this.state.size) break;

      let index = this.reverseIndex(currentI, currentJ);

      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }

    if (path.length + 1 === this.state.conditionalWinner) return path;
    currentI = coord.i;
    currentJ = coord.j;

    while (true) {
      currentI += 1;
      currentJ -= 1;

      if (currentI >= this.state.size || currentJ < 0) break;

      let index = this.reverseIndex(currentI, currentJ);

      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }
    if (path.length + 1 === this.state.conditionalWinner) return path;
  }

  checkWinner(squares, i) {
    const checkHorizontal = this.checkHorizontalWinner(squares, i);
    const checkVertical = this.checkVerticalWinner(squares, i);
    const checkDiagLeft = this.checkdiagonalLefWinner(squares, i);
    const checkDiagRight = this.checkDiagonalRightWinner(squares, i);

    if (checkHorizontal || checkVertical || checkDiagLeft || checkDiagRight)
      return squares[i];
    else return undefined;
  }

  handleClick(i) {
    if (this.state.winner) return;
    if (this.state.squares[i]) return;

    const squares = this.state.squares.slice();
    squares[i] = this.state.turnFlag === 1 ? `X` : `O`;

    this.setState({
      squares: squares,
      history: this.state.history.concat([squares]),
      turnFlag: this.state.turnFlag === 1 ? 0 : 1,
      winner: this.checkWinner(squares, i),
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = this.state.winner
      ? `The winner is ${this.state.winner}`
      : `Next player: ${this.state.turnFlag === 1 ? `X` : `O`}`;

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
    };
  }
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
