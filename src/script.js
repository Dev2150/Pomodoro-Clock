class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeFlows: false,
      breakLength: 5,
      sessionLength: 25,
      sLeft: 1500,
      timeS: "25:00",
      isSessionTime: true
    };
    this.intervalId = null;

    this.reset = this.reset.bind(this);
    this.startStop = this.startStop.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
  }
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.setState({ timeFlows: false });
  }
  startStop(timeFlows = !this.state.timeFlows) {
    if (this.intervalId == null) {
      this.intervalId = setInterval(() => {
        let sLeft = this.state.sLeft - 1;
        if (sLeft < 0) {
          let audio = document.getElementById("beep");
          audio.play();
          let isSessionTime = !this.state.isSessionTime;
          let sLeft =
            60 *
            (isSessionTime ? this.state.sessionLength : this.state.breakLength);
          this.setState({
            sLeft,
            timeS: this.formatTime(sLeft),
            isSessionTime,
            timeFlows: true
          });
        } else
          this.setState({
            sLeft,
            timeS: this.formatTime(sLeft)
          });
      }, 1000);
    } else {
      this.stop();
    }
  }
  reset() {
    this.setState({
      timeFlows: false,
      breakLength: 5,
      sessionLength: 25,
      sLeft: 25 * 60,
      timeS: "25:00",
      isSessionTime: true
    });
    this.stop();
    let audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }
  sessionIncrement() {
    if (this.intervalId) return;
    let sessionLength = this.state.sessionLength;
    sessionLength = Math.min(Math.max(sessionLength + 1, 1), 60);
    let sLeft = this.state.isSessionTime
      ? 60 * sessionLength
      : this.state.sLeft;
    this.setState({
      sessionLength,
      sLeft,
      timeS: this.formatTime(sLeft)
    });
  }
  sessionDecrement() {
    if (this.intervalId) return;
    let sessionLength = this.state.sessionLength;
    sessionLength = Math.min(Math.max(sessionLength - 1, 1), 60);
    let sLeft = this.state.isSessionTime
      ? 60 * sessionLength
      : this.state.sLeft;
    this.setState({
      sessionLength,
      sLeft,
      timeS: this.formatTime(sLeft)
    });
  }
  breakIncrement() {
    if (this.intervalId) return;
    let breakLength = Math.min(Math.max(this.state.breakLength + 1, 1), 60);
    let sLeft = this.state.isSessionTime ? this.state.sLeft : 60 * breakLength;
    this.setState({
      breakLength,
      sLeft,
      timeS: this.formatTime(sLeft)
    });
  }
  breakDecrement() {
    if (this.intervalId) return;
    let breakLength = Math.min(Math.max(this.state.breakLength - 1, 1), 60);
    let sLeft = this.state.isSessionTime ? this.state.sLeft : 60 * breakLength;
    this.setState({
      breakLength,
      sLeft,
      timeS: this.formatTime(sLeft)
    });
  }
  formatTime(timeLeft = this.state.sLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const remainingSeconds = timeLeft % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  render() {
    return (
      <div class="column center">
        <h1 id="main-title">25 + 5 Clock</h1>
        <div className="length-control">
          <div id="break-label">Break Length</div>
          <div className="row">
            <button id="break-decrement" onClick={this.breakDecrement}>
              <i class="fa-solid fa-arrow-down"></i>
            </button>
            <div id="break-length">{this.state.breakLength}</div>
            <button id="break-increment" onClick={this.breakIncrement}>
              <i class="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
        <div className="length-control">
          <div id="session-label">Session Length</div>
          <div className="row">
            <button id="session-decrement" onClick={this.sessionDecrement}>
              <i class="fa-solid fa-arrow-down"></i>
            </button>
            <div id="session-length">{this.state.sessionLength}</div>
            <button id="session-increment" onClick={this.sessionIncrement}>
              <i class="fa-solid fa-arrow-up"></i>
            </button>
          </div>
          <div className="timer">
            <audio
              id="beep"
              src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
              type="audio/wav"
            ></audio>
            <div class="timer-wrapper center column">
              <div id="timer-label">
                {this.state.isSessionTime ? "Session" : "Break"}
              </div>
              <div id="time-left">{this.state.timeS}</div>
            </div>
          </div>
          <div className="timer-control">
            <button id="start_stop" onClick={this.startStop}>
              <i class="fa-solid fa-play"></i>
              <i class="fa-solid fa-pause"></i>
            </button>
            <button id="reset" onClick={this.reset}>
              <i class="fa-solid fa-repeat"></i>
            </button>
          </div>
          <div className="author"></div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
