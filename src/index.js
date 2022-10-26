import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

class Square extends React.Component {
  render() {
    let className = this.props.winner ? `square winner` : `square`;
    return (
      <button className={className} onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, winner = false) {
    return (
      <Square
        winner={winner}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let boardRow = [];
    let idx = 0;
    for (let i = 0; i < this.props.size; i++) {
      let rowSquares = [];
      for (let j = 0; j < this.props.size; j++) {
        if (this.props.winner)
          rowSquares.push(
            this.props.winner.includes(i * this.props.size + j)
              ? this.renderSquare(idx, true)
              : this.renderSquare(idx)
          );
        else rowSquares.push(this.renderSquare(idx));
        idx++;
      }
      boardRow.push(
        <div key={i} className="board-row">
          {rowSquares}
        </div>
      );
    }
    return <div>{boardRow}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          turnFlag: 1,
          movement: null,
          squares: new Array(9).fill(undefined),
        },
      ],

      // ingame
      boardSize: 3,
      conditionalWinner: 5,
      winner: undefined,
      stepNumber: 0,
      isFinish: false,
      radioSelected: 0,
      isAscending: true,
    };
  }

  convertIndex(index) {
    return {
      i: Math.floor(index / this.state.boardSize),
      j: index % this.state.boardSize,
    };
  }
  reverseIndex(i, j) {
    return i * this.state.boardSize + j;
  }
  //vertical
  checkVerticalWinner(squares, latestIdx) {
    let path = [latestIdx];

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

    if (path.length === this.state.conditionalWinner) return path;
    currentI = coord.i;

    while (true) {
      currentI += 1;

      if (currentI >= this.state.boardSize) break;

      let index = this.reverseIndex(currentI, currentJ);
      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }
    if (path.length === this.state.conditionalWinner) return path;
    return null;
  }
  //horizontal
  checkHorizontalWinner(squares, latestIdx) {
    let path = [latestIdx];

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

    if (path.length === this.state.conditionalWinner) return path;
    currentJ = coord.j;

    while (true) {
      currentJ += 1;

      if (currentJ >= this.state.boardSize) break;

      let index = this.reverseIndex(currentI, currentJ);
      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }
    if (path.length === this.state.conditionalWinner) return path;
    return null;
  }
  //diagonalLeft
  checkdiagonalLefWinner(squares, latestIdx) {
    let path = [latestIdx];

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

    if (path.length === this.state.conditionalWinner) return path;
    currentI = coord.i;
    currentJ = coord.j;

    while (true) {
      currentI += 1;
      currentJ += 1;

      if (currentI >= this.state.boardSize || currentJ >= this.state.boardSize)
        break;

      let index = this.reverseIndex(currentI, currentJ);

      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }
    if (path.length === this.state.conditionalWinner) return path;
    return null;
  }
  //diagonalRight
  checkDiagonalRightWinner(squares, latestIdx) {
    let path = [latestIdx];

    let coord = this.convertIndex(latestIdx);

    let currentI = coord.i;
    let currentJ = coord.j;

    while (true) {
      currentI -= 1;
      currentJ += 1;

      if (currentI < 0 || currentJ >= this.state.boardSize) break;

      let index = this.reverseIndex(currentI, currentJ);

      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }

    if (path.length === this.state.conditionalWinner) return path;
    currentI = coord.i;
    currentJ = coord.j;

    while (true) {
      currentI += 1;
      currentJ -= 1;

      if (currentI >= this.state.boardSize || currentJ < 0) break;

      let index = this.reverseIndex(currentI, currentJ);

      if (squares[index] === squares[latestIdx]) {
        path.push(index);
      } else break;
    }
    if (path.length === this.state.conditionalWinner) return path;
    return null;
  }

  checkWinner(squares, i) {
    const checkHorizontal = this.checkHorizontalWinner(squares, i);
    const checkVertical = this.checkVerticalWinner(squares, i);
    const checkDiagLeft = this.checkdiagonalLefWinner(squares, i);
    const checkDiagRight = this.checkDiagonalRightWinner(squares, i);

    if (checkHorizontal) return checkHorizontal;
    if (checkVertical) return checkVertical;
    if (checkDiagLeft) return checkDiagLeft;
    if (checkDiagRight) return checkDiagRight;
    else return undefined;
  }

  undo(step) {
    this.setState({
      winner: undefined,
      stepNumber: step,
      isFinish: this.state.history[step].squares.includes(undefined)
        ? false
        : true,
    });
  }

  handleClick(i) {
    if (this.state.winner || this.state.isFinish) return;

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentSquare = history[history.length - 1].squares.slice();

    if (currentSquare[i]) return;

    const turnFlag = history[history.length - 1].turnFlag;
    const clickPoint = this.convertIndex(i);
    const movement = { i: clickPoint.i, j: clickPoint.j };

    let isFinish = false;
    if (!currentSquare.includes(undefined)) {
      isFinish = true;
    }

    currentSquare[i] = turnFlag === 1 ? `X` : `O`;

    this.setState({
      history: history.concat({
        turnFlag: turnFlag === 1 ? 0 : 1,
        squares: currentSquare,
        movement: movement,
      }),
      winner: this.checkWinner(currentSquare, i),
      stepNumber: history.length,
      isFinish: isFinish,
    });
  }

  handleRadioChange(event) {
    this.setState({
      radioSelected: Number(event.target.value),
    });
  }

  handleSortBtnClick() {
    this.setState({ isAscending: this.state.isAscending ? false : true });
  }

  render() {
    const history = this.state.history;
    const currentSquare = history[this.state.stepNumber].squares.slice();
    const turnFlag = history[this.state.stepNumber].turnFlag;

    let status = `Next player: ${turnFlag === 1 ? `X` : `O`}`;
    let statusClass = `game-status`;

    if (!currentSquare.includes(undefined)) {
      status = `Draw`;
      statusClass = `game-status draw`;
    }

    if (this.state.winner) {
      status = `The winner is ${currentSquare[this.state.winner[0]]}`;
      statusClass = `game-status win`;
    }

    const historicEvent = history.map((item, key) => {
      const msg1 = key ? `Go go step #${key}` : `Start`;
      const msg2 = item.movement
        ? `${item.turnFlag ? `X` : `O`} moved at (${item.movement.i},${
            item.movement.j
          })`
        : `Start`;

      return (
        <li key={key} className="game-record-item">
          <div>
            <button onClick={() => this.undo(key)}>{msg1}</button>
            <div className="form-check">
              <label
                className={
                  key === this.state.radioSelected
                    ? `label--bold`
                    : `label-normal`
                }
              >
                <input
                  type="radio"
                  name="react-tips"
                  value={key}
                  onClick={(event) => this.handleRadioChange(event)}
                />
                {msg2}
              </label>
            </div>
          </div>
        </li>
      );
    });

    if (!this.state.isAscending) historicEvent.reverse();

    return (
      <div className="game">
        <div className="game-col game-col-1">
          <div className="game-board">
            <Board
              winner={this.state.winner}
              size={this.state.boardSize}
              squares={currentSquare}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className={statusClass}>{status}</div>
          <button
            className="sort-btn"
            onClick={() => this.handleSortBtnClick()}
          >
            Sort
          </button>
        </div>

        <div className="game-col">
          <div className="game-record">
            <ol className="game-record-list">{historicEvent}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
