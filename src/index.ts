const queryString = window.location.search;
const params = new URLSearchParams(queryString);

const engineHost = params.get('engine') || 'https://fast.vc.eyevinn.technology';

window.addEventListener('DOMContentLoaded', async () => {
  const sectionMultiview = document.querySelector('#multiview');
  const inputEngineHost =
    document.querySelector<HTMLInputElement>('#engine-host');
  if (inputEngineHost && !inputEngineHost.value) {
    inputEngineHost.value = engineHost;
  }
  const buttonStart = document.querySelector<HTMLButtonElement>('#btn-start');
  const buttonFullScreen =
    document.querySelector<HTMLButtonElement>('#btn-fullscreen');

  updateThisUrl();

  buttonStart?.addEventListener('click', async () => {
    if (inputEngineHost && inputEngineHost.value) {
      while (sectionMultiview?.firstChild) {
        sectionMultiview?.firstChild.remove();
      }

      const engineUrl = new URL('/health', inputEngineHost.value);
      const response = await fetch(engineUrl.toString());
      if (response.ok) {
        const json = await response.json();
        if (json.sessionEndpoints) {
          json.sessionEndpoints.forEach(
            (endpoint: { playback: string | URL }) => {
              const video = document.createElement('eyevinn-video');
              video.setAttribute('muted', '');
              video.setAttribute('autoplay', '');
              video.setAttribute('autoplay-visible', '');
              video.setAttribute(
                'source',
                new URL(endpoint.playback, inputEngineHost.value).toString()
              );
              sectionMultiview?.appendChild(video);
            }
          );
        }
        updateThisUrl();
      }
    }
  });

  buttonFullScreen?.addEventListener('click', async () => {
    sectionMultiview?.requestFullscreen();
  });

  function updateThisUrl() {
    const url = new URL(window.location.href);
    if (inputEngineHost && inputEngineHost.value) {
      url.searchParams.set('engine', inputEngineHost.value);
      const thisUrl = document.querySelector<HTMLInputElement>('#thisurl');
      if (thisUrl) {
        thisUrl.value = url.toString();
      }
    }
  }
});
