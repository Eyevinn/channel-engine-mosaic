import { calculateColumns } from './util';

const queryString = window.location.search;
const params = new URLSearchParams(queryString);

const engineHost = params.get('engine') || 'https://fast.vc.eyevinn.technology';

interface Endpoint {
  playback: string | URL;
  health: string;
}

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
          json.sessionEndpoints.forEach((endpoint: Endpoint) => {
            const container = document.createElement('div');
            container.className = 'container';
            const video = document.createElement('eyevinn-video');
            video.setAttribute('muted', '');
            video.setAttribute('autoplay', '');
            video.setAttribute('autoplay-visible', '');
            video.setAttribute(
              'source',
              new URL(endpoint.playback, inputEngineHost.value).toString()
            );
            container.appendChild(video);
            sectionMultiview?.appendChild(container);

            const healthUrl = new URL(endpoint.health, inputEngineHost.value);

            const divChannelInfo = document.createElement('div');
            const channelId = healthUrl.pathname.split('/').pop();
            divChannelInfo.className = 'channel-name-overlay';
            divChannelInfo.dataset.channelId = channelId;
            divChannelInfo.innerHTML = `${channelId}`;
            container.appendChild(divChannelInfo);

            const divDebugInfo = document.createElement('div');
            divDebugInfo.dataset.channelId = channelId;
            divDebugInfo.dataset.healthUrl = healthUrl.toString();
            divDebugInfo.className = 'debug-overlay';
            container.appendChild(divDebugInfo);
          });
          const r = document.querySelector<HTMLElement>(':root');
          const columns = calculateColumns(json.sessionEndpoints.length);
          r?.style.setProperty('--fullscreen-column-count', columns.toString());
        }
        updateThisUrl();
        await updateDebugInfo();
        setInterval(updateDebugInfo, 5000);
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

  async function updateDebugInfo() {
    const debugInfos =
      document.querySelectorAll<HTMLDivElement>('.debug-overlay');
    debugInfos.forEach(async (debugInfo) => {
      const healthUrl = debugInfo.dataset.healthUrl;
      if (healthUrl) {
        const response = await fetch(healthUrl);
        if (response.ok) {
          const json = await response.json();
          debugInfo.innerHTML =
            `<div>TICK: ${json.tick}</div>` +
            `<div>MSEQ: ${json.mediaSeq}</div>`;
        }
      }
    });
  }
});
