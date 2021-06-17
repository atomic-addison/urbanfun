class Lumberjack {
  constructor(settings) {
    this.style = settings.style;
    this.t = settings.timestamp===undefined?true:settings.timestamp;
  }
	get time() {
		let d = new Date;
		return `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`;
	}
	log() {
    this.t?console.log(`%c${this.time}`, this.style, ...arguments):console.log(...arguments);
	}
}

const jack = new Lumberjack({
  style: `
    display:inline-block;
    box-sizing:border-box;
    color:#bcb;
    background:#232;
    padding:2px 3px 1px;
    border:1px #454 solid;
  `
});

function getPlayerName() {
  let cookies = document.cookie.split('; ');
  let pName;
  for (var i = 0; i < cookies.length; i++) {
    let item = cookies[i];
    if (item.startsWith("player")) {
      pName = item.substr(item.indexOf("=")+1, item.lastIndexOf("-")-7);
      break;
    }
  }
  return pName || false;
}

let showGPS = true;

function specialBlocks() {
  let blocks = document.evaluate('//td[@class="cp"]/table[@class="c"]/tbody/tr/td', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

  for (let i = 1; i < blocks.snapshotLength; i++) {
    let currentBlock = blocks.snapshotItem(i);
    let coordinates;

    switch (currentBlock.firstChild.tagName) {
      case 'INPUT':
        coordinates = getGPS(false);
        if (showGPS) showCoords(coordinates);
        break;
      case 'FORM':
        coordinates = currentBlock.innerHTML.match(/\d+-\d+/);
        coordinates = coordinates[0];
        break;
    }

    // mall blocks

    // northwest mall
    if (coordinates.match(/\b(32-44|43-9|78-73|49-98|19-27|25-9|75-28|84-41|66-55|90-79|99-77|28-76|85-65|58-52|52-80|52-23|20-81|92-7|67-44|62-62)\b/)) {
      if (currentBlock.className.match(/c6/)) currentBlock.className += ' c6-nw';
      else currentBlock.className += ' cx6-nw';
    }

    // northeast mall
    else if (coordinates.match(/\b(33-44|44-9|79-73|50-98|20-27|26-9|76-28|85-41|67-55|91-79|29-76|86-65|59-52|53-80|53-23|21-81|93-7|68-44|63-62)\b/)) {
      if (currentBlock.className.match(/c6/)) currentBlock.className += ' c6-ne';
      else currentBlock.className += ' cx6-ne';
    }

    // southwest mall
    else if (coordinates.match(/\b(32-45|43-10|78-74|49-99|19-28|25-10|75-29|84-42|66-56|90-80|99-78|28-77|85-66|58-53|52-24|20-82|92-8|67-45|62-63)\b/)) {
      if (currentBlock.className.match(/c6/)) currentBlock.className += ' c6-sw';
      else currentBlock.className += ' cx6-sw';
    }

    // southeast mall
    else if (coordinates.match(/\b(33-45|44-10|79-74|50-99|20-28|26-10|76-29|85-42|67-56|91-80|29-77|86-66|59-53|53-81|53-24|21-82|93-8|68-45|63-63)\b/)) {
      if (currentBlock.className.match(/c6/)) currentBlock.className += ' c6-se';
      else currentBlock.className += ' cx6-se';
    }

    // stadium blocks
    if (coordinates.match(/\b(51-81|47-43|60-6)\b/)) {
      if (currentBlock.className.match(/c16/)) currentBlock.className += ' c16-nw';
      else currentBlock.className += ' cx16-nw';
    }
    else if (coordinates.match(/\b(48-43|61-6)\b/)) {
      if (currentBlock.className.match(/c16/)) currentBlock.className += ' c16-ne';
      else currentBlock.className += ' cx16-ne';
    }

    // stadium overlaps mall
    else if (coordinates.match(/52-81/)) {
      if (currentBlock.className.match(/c16/)) currentBlock.className += ' c16-stadmall';
      else currentBlock.className += ' cx16-stadmall';
    }
    else if (coordinates.match(/\b(51-82|47-44|60-7)\b/)) {
      if (currentBlock.className.match(/c16/)) currentBlock.className += ' c16-sw';
      else currentBlock.className += ' cx16-sw';
    }
    else if (coordinates.match(/\b(52-82|48-44|61-7)\b/)) {
      if (currentBlock.className.match(/c16/)) currentBlock.className += ' c16-se';
      else currentBlock.className += ' cx16-se';
    }

    // mansion blocks
    if (coordinates.match(/\b(51-36|67-4|57-58|21-0|49-8)\b/)) {
      if (currentBlock.className.match(/c25/)) currentBlock.className += ' c25-nw';
      else currentBlock.className += ' cx25-nw';
    }
    else if (coordinates.match(/\b(52-36|68-4|58-58|22-0|50-8)\b/)) {
      if (currentBlock.className.match(/c25/)) currentBlock.className += ' c25-ne';
      else currentBlock.className += ' cx25-ne';
    }
    else if (coordinates.match(/\b(51-37|67-5|57-59|21-1|49-9)\b/)) {
      if (currentBlock.className.match(/c25/)) currentBlock.className += ' c25-sw';
      else currentBlock.className += ' cx25-sw';
    }
    else if (coordinates.match(/\b(52-37|68-5|58-59|22-1|50-9)\b/)) {
      if (currentBlock.className.match(/c25/)) currentBlock.className += ' c25-se';
      else currentBlock.className += ' cx25-se';
    }

    // fort blocks
    if (currentBlock.className.match(/c(39|4[0-5])/)) {
      if (coordinates.match(/(78-47|84-89)/)) currentBlock.className += ' c310';
      else if (coordinates.match(/(79-47|85-89)/)) currentBlock.className += ' c311';
      else if (coordinates.match(/(80-47|86-89)/)) currentBlock.className += ' c312';
      else if (coordinates.match(/(78-48|84-90)/)) currentBlock.className += ' c313';
      else if (coordinates.match(/(80-48|86-90)/)) currentBlock.className += ' c314';
      else if (coordinates.match(/(78-49|84-91)/)) currentBlock.className += ' c315';
      else if (coordinates.match(/(79-49|85-91)/)) currentBlock.className += ' c316';
      else if (coordinates.match(/(80-49|86-91)/)) currentBlock.className += ' c317';
    }

    // Christmas lights
    var lights = currentBlock.className.match(/light(g|r|w)/);
    if (lights) {
      if (currentBlock.className.match(/lightw/)) {
        currentBlock.innerHTML = '<div style="height:12px; background-image: url(' + "'../im/lights_w.png'" + ');"></div>' + currentBlock.innerHTML;
        continue;
      }
      else if (currentBlock.className.match(/lightrw/)) {
        currentBlock.innerHTML = '<div style="height:12px; background-image: url(' + "'../im/lights_rw.png'" + ');"></div>' + currentBlock.innerHTML;
        continue;
      }
      else if (currentBlock.className.match(/lightr/)) {
        currentBlock.innerHTML = '<div style="height:12px; background-image: url(' + "'../im/lights_r.png'" + ');"></div>' + currentBlock.innerHTML;
        continue;
      }
      else if (currentBlock.className.match(/lightgw/)) {
        currentBlock.innerHTML = '<div style="height:12px; background-image: url(' + "'../im/lights_gw.png'" + ');"></div>' + currentBlock.innerHTML;
        continue;
      }
      else if (currentBlock.className.match(/lightgrw/)) {
        currentBlock.innerHTML = '<div style="height:12px; background-image: url(' + "'../im/lights_grw.png'" + ');"></div>' + currentBlock.innerHTML;
        continue;
      }
      else if (currentBlock.className.match(/lightgr/)) {
        currentBlock.innerHTML = '<div style="height:12px; background-image: url(' + "'../im/lights_gr.png'" + ');"></div>' + currentBlock.innerHTML;
        continue;
      }
      else if (currentBlock.className.match(/lightg/)) {
        currentBlock.innerHTML = '<div style="height:12px; background-image: url(' + "'../im/lights_g.png'" + ');"></div>' + currentBlock.innerHTML;
        continue;
      }
    }
  }

  // Check if at edge of map
  if (blocks.snapshotLength < 10) addBorder();
}

function getGPS(bordercheck) {
  var neighboring_buttons = document.evaluate("//td[@class='cp']/table[@class='c']/tbody/tr[count(td/input) = 1]/td/form/input[@name='v']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  if (neighboring_buttons.snapshotLength == 0) return;

  var coords = neighboring_buttons.snapshotItem(0).value.split('-');
  var offset = neighboring_buttons.snapshotItem(0).parentNode.parentNode.nextSibling ? 1 : -1;
  var gps = (parseInt(coords[0]) + offset) + "-" + parseInt(coords[1]);

  if (bordercheck) gps = gps.split('-');

  return gps;
}

function showCoords(coordinates) {
  var elem = document.evaluate("//td[@class='cp']/table[@class='c']/tbody/tr/td[@class='sb']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

  if (elem.snapshotLength == 0 || !coordinates) return;

  // Create DSS Map link
  var url = "http://map.dssrzs.org/location/" + coordinates;
  var link = document.createElement('a');
  //link.href = url;
  link.href = "#";
  link.className = "block_coordinates";
  link.target = 'blank';
  var coords = coordinates.split('-');
  // x = coords[0], y = coords[1]
  link.textContent = ' [' + coords[0] + ',' + coords[1] + ']';

  elem.snapshotItem(0).appendChild(link);
}

function addBorder() {
  var coords = getGPS(true);
  var left = ((coords[0] == 0) ? true : false);
  var right = ((coords[0] == 99) ? true : false);
  var top = ((coords[1] == 0) ? true : false);
  var bottom = ((coords[1] == 99) ? true : false);

  var cityRows = document.getElementsByTagName('tr');
  var newCell;

  if (left || right) {
      newCell = cityRows[2].insertCell(left ? 0 : 2);
      newCell = cityRows[3].insertCell(left ? 0 : 2);
      if (!top && !bottom) {
          newCell = cityRows[4].insertCell(left ? 0 : 2);
      }
  }
}

function mapScenario() {
  jack.log("Loading settings for the map page...");

  document.body.classList.toggle("pretty-map");
  specialBlocks();
}

function profileScenario() {
  jack.log("Loading settings for the profile page...");

  //jack.log(getPlayerName());

  let url = new URL(window.location.href);
  let u_id = Number(url.searchParams.get("id"));

  if (!u_id) return jack.log("What the fuck, where is the ID?");

  document.body.insertAdjacentHTML('afterbegin', `
    <div class="d-ud__top">
      <ul class="d-ud__button-menu list-left">
        <li>
          <a href="map.cgi" class="d-ud__button">Back</a>
        </li>
      </ul>
      <ul class="d-ud__button-menu">
        <li>
          <a href="contacts.cgi?add=${u_id}" class="d-ud__button">Add to contacts</a>
        </li>
      </ul>
      <div class="list-spacer"></div>
      <ul class="d-ud__button-menu">
        ${u_id>0?`
          <li>
            <a href="profile.cgi?id=${u_id - 1}" class="d-ud__button">Previous</a>
          </li>
        `:''}
        <li>
          <a href="profile.cgi?id=${u_id + 1}" class="d-ud__button">Next user</a>
        </li>
      </ul>
    </div>
  `);

  //hide the bottom nav
  document.querySelector("a.y[href='map.cgi']").parentElement.style.display = 'none';
}

(function() {
  switch (window.location.pathname) {
    case '/profile.cgi':
      profileScenario();
      break;
    case '/map.cgi':
      mapScenario();
      break;
    default:
      jack.log("Fuck knows where the hell we are...");
      //dont run
  }
})();
