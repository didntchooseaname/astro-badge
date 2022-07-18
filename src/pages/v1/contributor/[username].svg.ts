import type { APIContext, EndpointOutput } from 'astro';
import contributors from '../../../data/contributors.json';
import { getAchievements } from '../../../util/getAchievements';
import { getStats } from '../../../util/getStats';

export function getStaticPaths() {
  return Object.keys(contributors).map((username) => ({
    params: { username },
  }));
}

const icons = {
  commits:
    '<path fill-rule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"></path>',
  issues:
    '<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>',
  pulls:
    '<path fill-rule="evenodd" d="M5 3.254V3.25v.005a.75.75 0 110-.005v.004zm.45 1.9a2.25 2.25 0 10-1.95.218v5.256a2.25 2.25 0 101.5 0V7.123A5.735 5.735 0 009.25 9h1.378a2.251 2.251 0 100-1.5H9.25a4.25 4.25 0 01-3.8-2.346zM12.75 9a.75.75 0 100-1.5.75.75 0 000 1.5zm-8.5 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>',
  // '<path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path>',
};

const SidebarBG = `<rect fill="#000" x="0" y="0" width="40" height="200" rx="19" ry="19" />`;

const Stat = ({ count, type }, i: number) => `<svg x="13" y="${45 + i * 40}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14">
${icons[type]}
</svg>
<text font-weight="bold" font-size="12" x="20" y="${73 + i * 40}" text-anchor="middle">${count}</text>`

const Achievement = ({ title, details }, i) =>
`<text x="50" y="${50 + i * 22}">${title} <tspan font-size="12" fill="#bbb">${details}</tspan></text>`

const AstroLogo = `<svg fill="none" viewBox="0 0 1281 1280" x="5" y="160" width="30" height="30">
<path fill="#fff" fill-rule="evenodd" d="M816 95c10 12 15 28 25 61l216 711c-80-42-167-72-259-88L657 303a18 18 0 0 0-35 0L483 779c-93 16-180 46-260 88l217-712c10-32 15-48 25-60 8-11 20-19 32-24 15-6 32-6 66-6h155c34 0 51 0 65 6 13 5 24 13 33 24Z" clip-rule="evenodd"/>
<path fill="#FF5D01" fill-rule="evenodd" d="M842 901c-36 30-107 51-189 51-101 0-185-31-208-73-8 24-10 51-10 69 0 0-5 87 56 147 0-31 25-57 56-57 54 0 54 47 54 85v4c0 57 35 107 85 128-7-16-11-33-11-51 0-55 32-76 69-100 30-19 64-40 86-82a155 155 0 0 0 12-121Z" clip-rule="evenodd"/>
</svg>`

export async function get({ params }: APIContext): Promise<EndpointOutput> {
  const { username } = params;
  const contributor = contributors[username];
  const avatar = await fetch(contributor.avatar_url);
  const b64 = Buffer.from(await (await avatar.blob()).arrayBuffer()).toString(
    'base64'
  );

  const achievements = getAchievements(contributor);
  const stats = getStats(contributor);

  const body = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 300 200" width="300" font-family="sans-serif" direction="ltr">
  <defs>
    <linearGradient id="a" x1="0" x2="0" y1="200" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="hsl(280, 65%, 20%)"/>
      <stop offset="1" stop-color="hsl(250, 43%, 26%)"/>
    </linearGradient>
    <clipPath id="avatar-clip"><circle cx="20" cy="20" r="15" /></clipPath>
  </defs>

  <rect fill="url(#a)" x="0" y="0" width="300" height="200" rx="19" ry="19" />
  ${SidebarBG}

  <g fill="white">
    ${stats.reverse().map(Stat).join('')}
    <g font-size="14">
      <text x="50" y="26" font-weight="bold">@${username}</text>
      ${achievements.slice(0, 7).map(Achievement)}
    </g>
  </g>
  ${AstroLogo}
  <!-- User avatar -->
  <image href="data:image/jpeg;base64,${b64}" x="5" y="5" width="30" height="30" clip-path="url(#avatar-clip)" />
</svg>`;

  return { body };
}

export const head = get;