/**
 * Adds a custom fullscreen button to a Video.js player's control bar.
 *
 * The button is inserted next to an existing control (remaining time display
 * or fullscreen toggle if present) to preserve the default control layout.
 *
 * @param {Object} player - Video.js player instance.
 * @param {Function} onFullScreen - Callback invoked when the custom button is clicked.
 */
const addCustomFullScreenButton = (player, onFullScreen) => {
  // @ts-ignore
  const controlBar = player.controlBar;
  const anchor =
    controlBar.getChild("remainingTimeDisplay") ??
    controlBar.getChild("fullscreenToggle");
  const index = anchor
    ? controlBar.children().indexOf(anchor)
    : controlBar.children().length;
  const button = controlBar.addChild("button", {}, index + 1);
  const buttonEl = button.el();
  buttonEl.innerHTML = "⛶";
  buttonEl.style.fontSize = "20px";
  buttonEl.onclick = () => onFullScreen(player);
};

const enhancePlayer = (player, options) => {
  const { onFullScreen } = options;

  if (onFullScreen) {
    addCustomFullScreenButton(player, onFullScreen);
  }
};

export default enhancePlayer;
