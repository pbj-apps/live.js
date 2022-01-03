/**
 * Mounts VOD Player Close Button template
 */
export default function (): string {
  return `
        <button type="button" class="close-button" hidden>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.289 1.289 12.71 12.71M12.711 1.289 1.289 12.71" stroke="currentColor"/></svg>
        </button>
      `;
}
