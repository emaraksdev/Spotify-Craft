// Made with Love by Yash Chittora [github.com/yashchittora]
// Remix by -emaraksdev <3 ['github.com/emaraksdev]

const isDarkMode = true;
const showBackground = false;

import { run } from "uebersicht";
import { css } from "uebersicht";

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  top: 2%;
  animation: fadeIn 1s linear;

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
`;

const darkModeStyles = isDarkMode
  ? css`background-color: black; color: white;`
  : css`background-color: white; color: black;`;

const backgroundStyles = showBackground
  ? css``
  : css`background-color: rgba(0, 0, 0, 0);`;

const text = css`
  padding: 5px 20px;
  font-size: 14px;
  font-family: futura;
  border-radius: 32px;
  user-select: none;
  cursor: default;
  ${darkModeStyles}
  ${backgroundStyles}
`;

// Function to check if an app is running
const isAppRunning = async (appName) => {
  try {
    const result = await run(`osascript -e 'tell application "System Events" to (name of processes) contains "${appName}"'`);
    return result.trim() === "true";
  } catch (error) {
    console.error(`Error checking if ${appName} is running:`, error);
    return false;
  }
};

// Function to get currently playing song from Apple Music
const getAppleMusicInfo = async () => {
  try {
    const result = await run(
      `osascript -e 'tell application "Music" to if player state is playing then return artist of current track & " - " & name of current track'`
    );
    return result.trim() || "Apple Music: Not playing";
  } catch (error) {
    console.error("Error getting Apple Music info:", error);
    return "Apple Music: Not playing";
  }
};

// Function to get currently playing song from Spotify
const getSpotifyInfo = async () => {
  try {
    const result = await run(
      `osascript -e 'tell application "Spotify" to if player state is playing then return artist of current track & " - " & name of current track'`
    );
    return result.trim() || "Spotify: Not playing";
  } catch (error) {
    console.error("Error getting Spotify info:", error);
    return "Spotify: Not playing";
  }
};

// Determine which music app is playing
const getMusicInfo = async () => {
  const isSpotifyRunning = await isAppRunning("Spotify");
  const isAppleMusicRunning = await isAppRunning("Music");

  if (isSpotifyRunning) {
    return await getSpotifyInfo();
  } else if (isAppleMusicRunning) {
    return await getAppleMusicInfo();
  }
  return "No music playing";
};

export const command = async (dispatch) => {
  const musicInfo = await getMusicInfo();
  dispatch({ type: "SET_INFO", musicInfo });
};

export const refreshFrequency = 1000;

export const initialState = { musicInfo: "" };

export const updateState = (event, previousState) => {
  switch (event.type) {
    case "SET_INFO":
      return { ...previousState, musicInfo: event.musicInfo };
    default:
      return previousState;
  }
};

export const render = ({ musicInfo }) => {
  return (
    <div className={container}>
      <p className={text}>
        <i className="fas fa-music"></i> {musicInfo}
      </p>
    </div>
  );
};
