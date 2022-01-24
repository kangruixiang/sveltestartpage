<script>
import Canvas from './components/Canvas.svelte';

let hue = Math.floor(Math.random() * 360)
let saturation = Math.floor(Math.random() * 100)
let value = Math.floor(Math.random() * (30-5) + 5);
let hue2 = hue
let saturation2 = saturation - 10
let value2 = value + 10
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
};
    return `#${f(0)}${f(8)}${f(4)}`;
}
console.log(hue, saturation, value)
 let randomColor = hslToHex(hue, saturation, value)
 let randomColorHighlight = hslToHex(hue2, saturation2, value2)
 console.log(randomColor, randomColorHighlight)

const sites = {
  "school": 
    [{
      "name": "Medhub",
      "url": "https://wfbmc.medhub.com"
    },
    {
      "name": "Citrix",
      "url": "https://portal2.wakehealth.edu"
    },
    {
      "name": "Intranet",
      "url": "https://intranet.wakehealth.edu/index.htm"
    },
    {
      "name": "Outlook",
      "url": "https://outlook.office365.com"
    },
    {
      "name": "MKSAP",
      "url": "https://mksap18.acponline.org/"
    },
  ],
  "personal": 
    [{
      "name": "Calendar",
      "url": "https://www.google.com/calendar/"
    },
    {
      "name": "Todoist",
      "url": "https://beta.todoist.com/app/"
    },
    {
      "name": "Drafts",
      "url": "https://draftin.com/documents"
    },
    {
      "name": "Drive",
      "url": "https://drive.google.com"
    },
    {
      "name": "Random Evernote",
      "url": "https://evernote-random.glitch.me/"
    },
  ],
  "social": 
    [{
      "name": "Reddit",
      "url": "http://old.reddit.com"
    },
    {
      "name": "Youtube",
      "url": "https://youtube.com"
    },
    {
      "name": "Messages",
      "url": "https://messages.google.com/web/"
    },
    {
      "name": "Telegram",
      "url": "https://web.telegram.org/"
    },
    {
      "name": "Gmail",
      "url": "https://gmail.com"
    },
    {
      "name": "Inoreader",
      "url": "https://www.inoreader.com/"
    },
  ],
  "finance": 
    [{
      "name": "Dicover",
      "url": "https://card.discover.com"
    },
    {
      "name": "Truliant",
      "url": "https://www.truliantfcuonline.org/tob/live/usp-core/app/login/consumer"
    },
    {
      "name": "Ally",
      "url": "https://secure.ally.com/"
    },
    {
      "name": "Vanguard",
      "url": "https://personal.vanguard.com/us/MyHome"
    },
    {
      "name": "Fedloan",
      "url": "https://accountaccess.myfedloan.org/accountAccess/index.cfm?event=common.home"
    },
    {
      "name": "YNAB",
      "url": "https://app.youneedabudget.com/"
    },
  ],
  "colorHighlight": randomColorHighlight
}


</script>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  @font-face {
    font-family: 'Concourse';
    src: url('fonts/concourse_3_regular.woff2') format('woff2');
    font-style: normal;
  }
  @font-face {
    font-family: 'Equity';
    src: url('fonts/equity_a_regular.woff2') format('woff2');
    font-style: normal;
  }
  @layer components {
	.card-title {
		@apply py-2 my-2 mx-2 px-2 text-2xl border-solid border-stone-200 border-b-2
			font-bold text-stone-200;
	}
}
</style>

<main class="flex justify-center h-screen" style="background-color: {randomColor}">
	<container class="container flex justify-center min-w-[80%]">
		<Canvas {...sites} />
	</container>
  
</main>


