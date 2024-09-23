import "./mixer.css";
const Mixer = () => {
  return (
    <div className="mixer">
      {/* Channel 1 */}
      <div className="channel">
        <div>
          <div className="channel-header">
            <h3>Channel 1</h3>
          </div>
          <div className="controls">
            <div className="fader">
              <input
                type="range"
                min="0"
                max="100"
                value="75"
                className="slider vertical"
              />
            </div>
            <div className="knob">
              <label>Pan</label>
              <input
                type="range"
                min="-50"
                max="50"
                value="0"
                className="slider horizontal"
              />
            </div>
            <div className="buttons">
              <button className="mute">Mute</button>
              <button className="solo">Solo</button>
            </div>
          </div>
        </div>
      </div>

      {/* Channel 2 */}
      <div className="channel">
        <div className="channel-header">
          <h3>Channel 2</h3>
        </div>
        <div className="controls">
          <div className="fader">
            <input
              type="range"
              min="0"
              max="100"
              value="65"
              className="slider vertical"
            />
          </div>
          <div className="knob">
            <label>Pan</label>
            <input
              type="range"
              min="-50"
              max="50"
              value="10"
              className="slider horizontal"
            />
          </div>
          <div className="buttons">
            <button className="mute">Mute</button>
            <button className="solo">Solo</button>
          </div>
        </div>
      </div>

      {/* Channel 3 */}
      <div className="channel">
        <div className="channel-header">
          <h3>Channel 3</h3>
        </div>
        <div className="controls">
          <div className="fader">
            <input
              type="range"
              min="0"
              max="100"
              value="50"
              className="slider vertical"
            />
          </div>
          <div className="knob">
            <label>Pan</label>
            <input
              type="range"
              min="-50"
              max="50"
              value="-15"
              className="slider horizontal"
            />
          </div>
          <div className="buttons">
            <button className="mute">Mute</button>
            <button className="solo">Solo</button>
          </div>
        </div>
      </div>

      {/* Master Volume */}
      <div className="channel master">
        <div className="channel-header">
          <h3>Master</h3>
        </div>
        <div className="controls">
          <div className="fader">
            <input
              type="range"
              min="0"
              max="100"
              value="80"
              className="slider vertical"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mixer;
