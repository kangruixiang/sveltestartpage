<script>
  import Canvas from "./components/Canvas.svelte";

  function hslToHex(h, s, l) {
    l /= 100;
    let a = (s * Math.min(l, 1 - l)) / 100;
    let f = (n) => {
      let k = (n + h / 30) % 12;
      let color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  const hue = Math.floor(Math.random() * (355 - 5) + 5);
  const saturation = Math.floor(Math.random() * (80 - 0) + 0);
  const value = Math.floor(Math.random() * (95 - 5) + 5);
  const saturationDull = Math.max(5, saturation - 5);
  const valueLight = Math.min(95, value + 5);
  const saturationBright = Math.min(95, saturation + 5);
  const valueDark = Math.max(5, value - 5);

  console.log("original", hue, saturation, value);
  console.log("lighter", hue, saturationDull, valueLight);
  console.log("darker", hue, saturationBright, valueDark);

  const randomColor = hslToHex(hue, saturation, value);
  const randomColorLight = hslToHex(hue, saturationDull, valueLight);
  const randomColorDark = hslToHex(hue, saturationBright, valueDark);
  let textColor, colorVariant;
  if (value > 50) {
    // light background
    textColor = "#070808"; // darker text
    colorVariant = randomColorDark; // variant darker
    console.log("darker");
  } else {
    // darker background
    textColor = "#d6d6d6"; // lighter text
    colorVariant = randomColorLight; // variant lighter
    console.log("lighter");
  }

  console.log("randomColor:", randomColor);
  console.log("colorVariant:", colorVariant);
  console.log("textColor:", textColor);

  const sites = {
    school: [
      {
        name: "Medhub",
        url: "https://wfbmc.medhub.com",
      },
      {
        name: "Portal",
        url: "https://wakeportal.wakehealth.edu",
      },
      {
        name: "Outlook",
        url: "https://outlook.office365.com",
      },
      {
        name: "SEEK",
        url: "https://seek.chestnet.org/Users/Home.aspx",
      },
    ],
    personal: [
      {
        name: "Todoist",
        url: "https://todoist.com/app/",
      },
      {
        name: "Colors",
        url: "https://color.krxiang.com",
      },
      {
        name: "Homarr",
        url: "http://100.92.18.77:7575",
      },
      {
        name: "Random Evernote",
        url: "https://evernote-random.glitch.me/",
      },
      {
        name: "Wiki",
        url: "https://wiki.krxiang.com/",
      },
      {
        name: "Moodist",
        url: "https://moodist.app/",
      },
    ],
    social: [
      {
        name: "Reddit",
        url: "http://old.reddit.com",
      },
      {
        name: "Youtube",
        url: "https://youtube.com",
      },
      {
        name: "Telegram",
        url: "https://web.telegram.org/",
      },
      {
        name: "Gmail",
        url: "https://gmail.com",
      },
      {
        name: "Inoreader",
        url: "https://www.inoreader.com/",
      },
    ],
    finance: [
      {
        name: "Dicover",
        url: "https://card.discover.com",
      },
      {
        name: "Truliant",
        url: "https://www.truliantfcuonline.org/tob/live/usp-core/app/login/consumer",
      },
      {
        name: "Ally",
        url: "https://secure.ally.com/",
      },
      {
        name: "Vanguard",
        url: "https://investor.vanguard.com/my-account/log-on",
      },
      {
        name: "Actual",
        url: "https://actual.kangruixiang.synology.me/",
      },
      {
        name: "FNB",
        url: "https://banking.fnb-onlinebankingcenter.com/FNBPA/Login.aspx#",
      },
      {
        name: "Water Bill",
        url: "https://waterbills.cityofws.org/webinquiry/JSP/login.jsp",
      },
      {
        name: "Capstone",
        url: "https://capstonetriad.cincwebaxis.com/ ",
      },
    ],
  };
</script>

<main
  class="flex justify-center min-h-screen"
  style="background-color: {randomColor}"
>
  <container class="container flex justify-center min-w-[80%]">
    <Canvas {...sites} {randomColor} {colorVariant} {textColor} />
  </container>
</main>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  @font-face {
    font-family: "Concourse";
    src: url("fonts/concourse_3_regular.woff2") format("woff2");
    font-style: normal;
  }
  @font-face {
    font-family: "Equity";
    src: url("fonts/equity_a_regular.woff2") format("woff2");
    font-style: normal;
  }
  @layer components {
    .card-title {
      @apply py-2;
    }
  }
</style>
