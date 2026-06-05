const fs = require('fs');

const corruptedHtml = fs.readFileSync('index.html', 'utf8');

// We know the corrupted HTML has the full body somewhere.
// In the original file, body ends with:
//   </button>
// 
// <script>
// (function(){

// Let's just use the known parts.
const headStart = corruptedHtml.indexOf('<!DOCTYPE html>');
const bodyStart = corruptedHtml.indexOf('<body>') + 6;

// The end of the HTML structure is right before `<script>` which was replaced or kept.
const bodyEndMarker = '<button class="gd-ov-close" id="btnClose">';
const bodyEndIndex = corruptedHtml.indexOf(bodyEndMarker);

// Wait, btnClose is followed by its inner HTML:
//   <button class="gd-ov-close" id="btnClose">
//     <span class="gd-ov-close-x">×</span>
//     <span class="gd-ov-close-esc">ESC</span>
//   </button>
// So let's find `</button>` after btnClose
const btnCloseEnd = corruptedHtml.indexOf('</button>', bodyEndIndex) + 9;

const pureBodyHtml = corruptedHtml.substring(bodyStart, btnCloseEnd);

const newIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Game Dev \u2014 Portfolio</title>
  <meta name="description" content="Game development showcase \u2014 interactive experiences and virtual worlds." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
${pureBodyHtml}

  <script src="js/main.js"></script>
</body>
</html>`;

fs.writeFileSync('index.html', newIndexHtml);

// And copy test.js to js/main.js
fs.copyFileSync('test.js', 'js/main.js');

// delete test.js and split.js
fs.unlinkSync('test.js');
fs.unlinkSync('split.js');
