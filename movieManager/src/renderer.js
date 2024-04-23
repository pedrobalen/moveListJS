const fs = require('fs');
const path = require('path');
const { shell } = require('electron');
const { ipcRenderer } = require('electron');

const videoContainer = document.getElementById('videoList');
const countElement = document.getElementById('fileCount');
const searchInput = document.getElementById('searchInput');
let videoCount = 0;
let videos = []; 

function findVideos(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("Error:", err);
      return;
    }

    files.forEach(file => {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        findVideos(fullPath);
      } else if (file.name.match(/\.(mp4|mkv|avi|mov|flv)$/)) {
        videos.push({ name: file.name, path: fullPath });
      }
    });

    displayVideos(videos);
  });
}

function displayVideos(filteredVideos) {
  videoContainer.innerHTML = '';
  videoCount = 0;
  filteredVideos.forEach(video => {
    videoCount++;
    const listItem = document.createElement('li');
    listItem.textContent = video.name;
    listItem.style.cursor = 'pointer';
    listItem.addEventListener('click', () => {
      console.log("Clicked: " + video.path);
      shell.openPath(video.path);
    });
    videoContainer.appendChild(listItem);
  });
  countElement.textContent = `${videoCount} movies`;
}

function filterMovies() {
  const searchText = searchInput.value.toLowerCase();
  const filteredVideos = videos.filter(video => video.name.toLowerCase().includes(searchText));
  displayVideos(filteredVideos);
}

document.getElementById('chooseFolder').addEventListener('click', () => {
  ipcRenderer.send('open-file-dialog');
});

ipcRenderer.on('selected-directory', (event, paths) => {
  videos = []; 
  findVideos(paths[0]);
});
