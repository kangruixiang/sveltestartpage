<script>
import Canvas from './components/Canvas.svelte';
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
  ],}

</script>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  :global(body) {
		height: 100vh;
		background-color: #131313;
	}
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

<main class="text-center p-4 mx-auto h-full  flex justify-center flex-row">
	<container class="flex justify-center flex-row min-w-[80%]">
		<Canvas {...sites} />
	</container>
  
</main>


