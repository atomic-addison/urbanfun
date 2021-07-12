(function() {
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

  const c = new Lumberjack({
    style: `
      display:inline-block;
      box-sizing:border-box;
      color:#bcb;
      background:#232;
      padding:2px 3px 1px;
      border:1px #454 solid;
    `
  });

  class UrbanDead {
    constructor(args) {
      this.doc = args.doc;
      this.leftCell;
      this.cityMap;
      this.headsUpDisplay;
      this.isDead;
      this.cityCells;
      this.showGPS;
      this.p_id;
      //initialize class handle
      document.body.classList.add("d-ud");
    }
    getGPS(bordercheck) {
      var neighboring_buttons = document.evaluate("//td[@class='cp']/table[@class='c']/tbody/tr[count(td/input) = 1]/td/form/input[@name='v']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      if (neighboring_buttons.snapshotLength == 0) return;

      var coords = neighboring_buttons.snapshotItem(0).value.split('-');
      var offset = neighboring_buttons.snapshotItem(0).parentNode.parentNode.nextSibling ? 1 : -1;
      var gps = (parseInt(coords[0]) + offset) + "-" + parseInt(coords[1]);

      if (bordercheck) gps = gps.split('-');

      return gps;
    }
    addBorder() {
      let coords = this.getGPS(true);

      let left = ((coords[0] == 0) ? true : false);
      let right = ((coords[0] == 99) ? true : false);
      let top = ((coords[1] == 0) ? true : false);
      let bottom = ((coords[1] == 99) ? true : false);

      //needs testing

      let cityRows = document.querySelectorAll("table.c>tbody>tr");

      if (left) for (var i = 1; i < cityRows.length; i++) cityRows[i].insertCell(0);
      if (right) for (var i = 1; i < cityRows.length; i++) cityRows[i].insertCell(-1);
      if (bottom) {
        let newRow = document.querySelector("table.c").insertRow(-1);

        for (var i = 0; i < 3; i++) {
          let newCell = newRow.insertCell();
          newCell.className = "b border";
          newCell.innerHTML = `<input type="submit" class="ml" value="Border">`;
        }
      }
      if (top) {
        let newRow = document.querySelector("table.c").insertRow(1);

        for (var i = 0; i < 3; i++) {
          let newCell = newRow.insertCell();
          newCell.className = "b border";
          newCell.innerHTML = `<input type="submit" class="ml" value="Border">`;
        }
      }
    }
    showCoords(coordinates) {
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
    specialBlocks() {
      let blocks = document.evaluate('//td[@class="cp"]/table[@class="c"]/tbody/tr/td', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

      for (let i = 1; i < blocks.snapshotLength; i++) {
        let currentBlock = blocks.snapshotItem(i);
        let coordinates;

        switch (currentBlock.firstChild.tagName) {
          case 'INPUT':
            coordinates = this.getGPS(false);
            if (this.showGPS) this.showCoords(coordinates);
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
      if (blocks.snapshotLength < 10) this.addBorder();
    }
    getPlayerName() {
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
    createBarGraph(iconName, value, maxValue, notches, textHighlight){
    	try{
    		var barTable = this.doc.createElement("TABLE");
    		barTable.setAttribute("id", iconName + "Table");
    		barTable.className = "stattable";

    		var iconRow = barTable.insertRow(0);
    		var barRow = barTable.insertRow(1);
    		var fillerRow = barTable.insertRow(2);

    		var iconCell = iconRow.insertCell(0);
    		iconCell.setAttribute("rowspan", "2");
    		iconCell.className = "iconCell";

    		iconCell.innerHTML = '<div class="statIcons"></div>'
    			+ '<div class="statIconBackground" style="opacity:' + value / maxValue + '"></div>';

    		var fillerCell = iconRow.insertCell(1);
    		var barCell = barRow.insertCell(0);
    		var barTable2 = this.doc.createElement("TABLE");
    		var barRow2 = barTable2.insertRow(0);
    		var barCell2 = new Array();

    		for (var i = 0; i < notches; i++)
    		{
    			barCell2[i] = barRow2.insertCell(i);
    			barCell2[i].setAttribute("style", "width:" + 100/notches + "%");
    			barCell2[i].innerHTML += '<div class="notchBorders">'
    				+ '<div class="barBackground'
    				+ ((i < value/(maxValue/notches)) ? '':' clearNotch')
    				+ '" style="opacity:' + ((i < value/(maxValue/notches)) ? (value / maxValue):0)
    				+ '"></div></div>';
    		}

    		barCell.setAttribute("style", "width:100%");
    		barCell.appendChild(barTable2);
    		var statsCell = fillerRow.insertCell(0);
    		fillerCell = fillerRow.insertCell(1);

    		if (textHighlight)
    			statsCell.innerHTML = '<span class="highLight">' + value + '</span>';
    		else
    			statsCell.innerHTML = '<span>' + value + '</span>';

    		return barTable;
    	}catch(err){err = "graphicalStats:"+err; c.log(err);}
    }
    graphicalStats(){
    	try{
    		let icons = ["HP", "AP", "XP"];
    		let stats = [0,0,0];
    		let scale = [60, 50, 150];
    		let notches = [12, 10, 10];
    		let highlight = 0;

    		let isInfected = ((this.headsUpDisplay.innerHTML.search(/you are <b>infected<\/b>/) > -1) ?1:0); //Or infected
    		if (this.isDead || isInfected) {
          //set the appropriate HP icon
    			if (isDead) {
    				icons[0] = "HPDead";
    				//overlay(cityCells, "dead");
    			}
    			else {
    				icons[0] = "HPInfected";
    				//overlay(cityCells, "infection");
    			}
    		}

    		let statsMatch = this.headsUpDisplay.innerHTML.match(/(<a.*a>).*?((\d+).*?(\d+).*?(\d+)|(-?\d+))/); //Grab all stats and name
    		let nameLink = statsMatch[1]; //Get the name link

    		if (statsMatch[3] == undefined) {
          //Look for stats
    			if (statsMatch[6] != undefined) {
            //Check if AP is shown
    				stats[1] = statsMatch[6]; //AP, other stats not shown
    			}
    		}
        else {
    			stats[0] = statsMatch[3]; //HP
    			stats[2] = statsMatch[4]; //XP
    			stats[1] = statsMatch[5]; //AP
    		}

    		let statsTable = this.doc.createElement("TABLE"); //Create the main stats table
    		statsTable.className = "statstable";
    		let statRow = statsTable.insertRow(0);
    		let statCells = new Array();

    		for (let i = 0; i < 3; i++) {
    			statCells[i] = statRow.insertCell(i);

    			if (i < 2 && stats[i] < 10) highlight = true;
    			else highlight = false;

    			statCells[i].appendChild(this.createBarGraph(icons[i], stats[i], scale[i], notches[i], highlight));
    		}

    		this.headsUpDisplay.innerHTML = nameLink;
    		this.headsUpDisplay.appendChild(statsTable);
    	}
      catch(err) {
        err = "graphicalStats: "+err;
        c.log(err);
      }
    }
    makeItem(item){
    	// Main container for item
    	var container = this.doc.createElement("DIV");

    	// Sub container for button, drop button and span
    	var subContainer = this.doc.createElement("DIV");


    	// Main button
    	var itemForm = this.doc.createElement("FORM");
    	itemForm.setAttribute("method", "post");

    	var itemButton = this.doc.createElement("INPUT");
    	itemButton.className = "itemButton";
    	itemButton.value = "";
    	itemButton.setAttribute("type", "submit");
    	itemForm.appendChild(itemButton);


    	// Drop button for item
    	var dropForm = this.doc.createElement("FORM");
    	dropForm.action = "map.cgi";
    	dropForm.setAttribute("method", "post");

    	var dropButton = this.doc.createElement("INPUT");
    	dropButton.value = "";
    	dropButton.className = "dropButton";
    	dropButton.setAttribute("type", "submit");

    	var dropItem = this.doc.createElement("INPUT");
    	dropItem.setAttribute("name", "drop");
      c.log("TEST!!", item);
    	dropItem.value = item.replace(/\./, "");
    	dropItem.setAttribute("type", "hidden");

    	dropForm.appendChild(dropButton);
    	dropForm.appendChild(dropItem);

    	subContainer.appendChild(itemForm);
    	subContainer.appendChild(dropForm);

    	// Title/Description for item
    	var itemInfo = this.doc.createElement("DIV");
    	itemInfo.className = "itemInfo";

    	var title = this.doc.createElement("DIV");
    	title.className = "itemTitle";

    	var description = this.doc.createElement("DIV");
    	description.className = "itemDesc";

    	itemInfo.appendChild(title);
    	itemInfo.appendChild(description);

    	container.appendChild(itemInfo);
    	container.appendChild(subContainer);

    	var itemType = item.substr(0, 1); //Item type for use command is first letter

    //Max
    	// decorations and toolbox need to the whole item string appended to use-
    	if ( item.indexOf("D") > -1 ||  item.indexOf("I") > -1 || item.indexOf("J") > -1 )
    		itemForm.action = "map.cgi?use-" + item;
    	else
    		itemForm.action = "map.cgi?use-" + itemType;

    	var ammoCount = item.substr(1, item.length - 1); //Ammo count if available, remaining portion of the string

    	// decorations and toolbox need to have the ammoCount wiped off.
    	if ( item.indexOf("D") > -1 || item.indexOf("I") > -1 || item.indexOf("J") > -1 ) ammoCount = null;

    	if (itemType != itemType.toLowerCase())
    		itemType = itemType + itemType; //To distinguish "A" from "a" in the CSS since the doctype used by UD makes the CSS case insensitive

    	// decorations and toolbox can use the whole item string for the class name
    	if ( item.indexOf("D") > -1 || item.indexOf("I") > -1 || item.indexOf("J") > -1 )
    		container.className = "i" + item;
    	else
    		container.className = "i" + itemType;
    //Max

    	if (ammoCount)
    	{
    		if (ammoCount.length > 2) //Radio frequency rather than firearm ammo
    		{
    			var radioInput = this.doc.createElement("INPUT"); //Radios use an extra input for frequency
    			radioInput.setAttribute("type", "hidden");
    			radioInput.setAttribute("name", "freq");
    			radioInput.setAttribute("value", item.substr(1, item.length - 1).replace(/\./, ""));
    			itemForm.appendChild(radioInput);
    		}
    		var ammoCountSpan = this.doc.createElement("SPAN");
    		ammoCountSpan.className = "ammoCount";
    		ammoCountSpan.innerHTML = ammoCount;
    		subContainer.appendChild(ammoCountSpan);
    	}

    	return container;
    }
    itemPriority(itemType){
    	if (itemType == "b6") //Pistols
    		return 0;
    	if (itemType == "b5")
    		return 1;
    	if (itemType == "b4")
    		return 2;
    	if (itemType == "b3")
    		return 3;
    	if (itemType == "b2")
    		return 4;
    	if (itemType == "b1")
    		return 5;
    	if (itemType == "b0")
    		return 6;
    	if (itemType == "s2") //Shotguns
    		return 7;
    	if (itemType == "s1")
    		return 8;
    	if (itemType == "s0")
    		return 9;
    	if (itemType.indexOf("B") > -1) //Handheld Radio, I've placed it high on the priority list to prevent problems with table cell stretching
    		return 10;
    	if (itemType == "c") //Flare guns
    		return 11;
    	if (itemType == "k") //Pistol Clips
    		return 12;
    	if (itemType == "r") //Shotgun shells
    		return 13;
    	if (itemType == "o") //Fire axes
    		return 14;
    	if (itemType == "d") //Crowbars
    		return 15;
    	if (itemType == "e") //Baseball bats
    		return 16;
    	if (itemType == "p") //Length of pipes
    		return 17;
    	if (itemType == "g") //Kitchen knifes
    		return 18;
    	if (itemType == "h") //FAKs
    		return 19;
    	if (itemType == "z") //Syringes
    		return 20;
    	if (itemType == "w") //Extractors
    		return 21;
    	if (itemType == "f") //Flak jackets
    		return 22;
    	if (itemType == "F") //Binoculars
    		return 23;
    	if (itemType == "C") //Radio Transmitter
    		return 24;
    	if (itemType == "a") //GPS units
    		return 25;
    	if (itemType == "j") //Mobile phones
    		return 26;
    	if (itemType == "A") //Portable generators
    		return 27;
    	if (itemType == "i") //fuel cans
    		return 28;
    	if (itemType == "q") //wire cutters
    		return 29;
    	if (itemType == "x") //Spray cans
    		return 30;
    	if (itemType == "t") //beers
    		return 31;
    	if (itemType == "u") //wine bottles
    		return 32;
    	if (itemType == "l") //books
    		return 33;
    	if (itemType == "y") //poetry books
    		return 34;
    	if (itemType == "n") //newspapers
    		return 35;
    	if (itemType == "m") //crucifixes
    		return 36;
    	return 37; // In case I missed something
    }
    inventorySort(items){
    	var j;
    	var index;
    	for (var i = 0; i < items.length; i++)
    	{
    		index = items[i];
    		j = i;
    		while ((j > 0) && (this.itemPriority(items[j-1]) > this.itemPriority(index)))
    		{
    			items[j] = items[j-1];
    			j = j - 1;
    		}
    		items[j] = index;
    	}
    }
    inventory(isInventoryOpen) {
      c.log("Hi!")
    	try{
    		var forms = this.doc.getElementsByTagName("form");
    		var itemType = new String();
    		var items = new Array();

    		var length = this.actionForms.length;
    		for (var i = 0; i < length; i++)
    		{
    //Max
    //			if (actionForms[i].action.search(/map\.cgi\?use\-[A-Za-z]/) > -1)
    //			{
    //				itemType = actionForms[i].action.match(/map\.cgi\?use\-(\w)/)[1];
    			if (this.actionForms[i].action.search(/map\.cgi\?use\-[A-Za-z1-9]+/) > -1)
    			{
    				itemType = this.actionForms[i].action.match(/map\.cgi\?use\-([\w\d]+)/)[1];
    //Max

    				if (itemType == "b" || itemType == "s" || itemType == "B")
    				{
    					itemType += this.actionForms[i].innerHTML.match(/(\d+\.)?\d+/)[0];
    				}
    				if (itemType == "F" && this.actionForms[i].getElementsByTagName("select").length > 0)
    				{
    					addBinoculars(this.doc, this.cityCells);
    				}
    				items.push(itemType);
    			}
    		}

    		this.inventorySort(items); //Sort items

    		var inventoryRow = new Array();
    		var inventoryCell = new Array();
    		var ammoCount = new String();
    		var pistolAmmo = 0;
    		var shotgunAmmo = 0;
    		var pistolClips = 0;
    		var shotgunShells = 0;
    		var FAKS = 0;
    		var syringes = 0;
    		var width = 10;
    		var index = -1;
    		var offset = 0;
    		var j = 0;

    		var inventoryTable = this.doc.createElement("TABLE");
    		inventoryTable.className = "inventory";
    		inventoryTable.id = "inventoryTable";

    		for (var i = 0; i+offset < 60 || i < items.length; i++) //Loop to construct table
    		{
    			if ((i+offset) % width == 0)
    			{
    				index++;
    				inventoryRow[index] = inventoryTable.insertRow(index);
    				j = 0;
    			}

    			inventoryCell[i] = inventoryRow[index].insertCell(j);
    			j++;
    			if (i < items.length)
    			{
    				if (items[i].indexOf("B") > -1 && (i + offset) % 10 > 5) //Shift the radios so they don't screw up the table
    				{
    					for (var k = i+1; k < items.length; k++)
    					{
    						if ( items[k].indexOf("B") < 0 ) //Look for an item which isn't a radio
    						{
    							itemType = items[k]; //Swap items
    							items[k] = items[i];
    							items[i] = itemType;
    							break;
    						}
    					}
    				}

    				inventoryCell[i].className = "item";
    				inventoryCell[i].appendChild(this.makeItem(items[i])); //Create and append item to cell

    				if (items[i].search(/[bskrhzB]/) > -1) //Find important items, store item/ammo counts
    				{
    					if (items[i].indexOf("b") > -1 || items[i].indexOf("s") > -1)
    					{
    						itemType = items[i].substr(0, 1); //Item type
    						ammoCount = items[i].substr(1, 1); //Ammo count
    						inventoryCell[i].setAttribute("colspan", "2");
    						offset+=1;
    						if (items[i].indexOf("b") > -1)
    							pistolAmmo += parseInt(ammoCount);
    						else
    							shotgunAmmo += parseInt(ammoCount);
    					} else
    					if (items[i] == "k")
    					{
    						pistolClips++;
    					} else
    					if (items[i] == "r")
    					{
    						shotgunShells++;
    					} else
    					if (items[i] == "h")
    					{
    						FAKS++;
    					} else
    					if (items[i] == "z")
    					{
    						syringes++;
    					} else
    					if (items[i].indexOf("B") > -1)
    					{
    						inventoryCell[i].setAttribute("colspan", "5");
    						offset+=4;
    					}
    				}
    			} else {
    				inventoryCell[i].innerHTML = "&nbsp;";
    				if (i + offset >= 51)
    				{
    					inventoryCell[i].className = "itotal";
    				}
    			}
    		}

    		inventoryCell[i-1].innerHTML = "<span>" + (items.length + offset) + "/51</span>";

    		var summaryTable = this.doc.createElement("table");
    		summaryTable.className = "inventory";
    		summaryTable.id = "inventoryBar";

    		var summaryRow = summaryTable.insertRow(0);
    		var summaryCell = new Array();

    		summaryCell[0] = summaryRow.insertCell(0);
    		summaryCell[0].className = "item";
    		summaryCell[0].appendChild(this.makeItem("b"+pistolAmmo));
    		summaryCell[1] = summaryRow.insertCell(1);
    		summaryCell[1].className = "item";
    		summaryCell[1].appendChild(this.makeItem("s"+shotgunAmmo));
    		summaryCell[2] = summaryRow.insertCell(2);
    		summaryCell[2].className = "item";
    		summaryCell[2].appendChild(this.makeItem("k"+pistolClips));
    		summaryCell[3] = summaryRow.insertCell(3);
    		summaryCell[3].className = "item";
    		summaryCell[3].appendChild(this.makeItem("r"+shotgunShells));
    		summaryCell[4] = summaryRow.insertCell(4);
    		summaryCell[4].className = "item";
    		summaryCell[4].appendChild(this.makeItem("h"+FAKS));
    		summaryCell[5] = summaryRow.insertCell(5);
    		summaryCell[5].className = "item";
    		summaryCell[5].appendChild(this.makeItem("z"+syringes));

    		var container = this.doc.createElement("DIV");

    		var carrot = this.doc.createElement("DIV");
    		carrot.id = "invCarrot";
        /*
        function (),
        */
    		carrot.addEventListener('click', function () {
          try{
            var child = this.parentNode.getElementsByTagName("TABLE")[0];

            if (child.style.display == "none")
            {
              child.style.display = "table";
              this.className = "carrotOpen";

            } else
            {
              child.style.display = "none";
              this.className = "carrotClosed";
            }
          }
          catch(err){
            err = "Error displaying names "+err;
            c.log(err);
          }
        }, false);

    		container.appendChild(carrot);
    		container.appendChild(inventoryTable);

    		//summaryCell[6] = summaryRow.insertCell(6);
    		//summaryCell[6].appendChild(carrot);
    		//summaryCell[6].appendChild(inventoryTable);

    		if (isInventoryOpen)
    		{
    			carrot.className = "carrotOpen";
    		} else
    		{
    			inventoryTable.style.display = "none";
    			carrot.className = "carrotClosed";
    		}

    		this.headsUpDisplay.appendChild(summaryTable);
    		this.headsUpDisplay.appendChild(container);
    //Max
    //		headsUpDisplay.appendChild(createBarGraph(doc, "INV", items.length + offset, 51, 51, (items.length + offset > 45) ? true:false));

    		// Encumbrance Scale
    		var gameText = this.doc.getElementsByClassName("gp", "td")[0];
    		var ps = gameText.getElementsByTagName("P");
    		var Cumber = null;
    		var encumberance = 0;
    		for (var p = ps.length - 1; p >= 0; p--)
    		{
    			Cumber = ps[p].innerHTML.match(/^You are (\d+)\% encumbered.$/); // You are 60% encumbered.
    			if (Cumber)
    			{
    				encumberance = parseInt(Cumber[1]);

    				gameText.removeChild(ps[p]);

    				break;
    			}
    		}
    		this.headsUpDisplay.appendChild(this.createBarGraph("INV", encumberance, 120, 60, (encumberance > 88) ? true:false));
    //Max

    	}
      catch(err){
        err = "Error constructing inventory " + err;
        c.log(err);
      }
    }
    drawHeader(page) {
      let viewing = document.querySelector("span.ptt").textContent || NULL;

      let url = new URL(window.location.href);

      //get the id of the player being viewed
      let u_id = Number(url.searchParams.get("id"));

      //get player's ID
      let user_ID = localStorage.getItem('user_ID');

      document.body.insertAdjacentHTML('afterbegin', `
        <div class="d-ud__top">
          <ul class="d-ud__top__button-menu">
            <li>
              <a href="map.cgi" class="d-ud__top__button-menu__button">Back to the city</a>
            </li>
          </ul>
          <div class="d-ud__top__list-spacer"></div>
          <ul class="d-ud__top__button-menu list-left">
            <li>
              <a href="skills.cgi" class="d-ud__top__button-menu__button">Skills</a>
            </li>
            ${user_ID?`
              <li>
                <a href="profile.cgi?mode=edit&id=${user_ID}" class="d-ud__top__button-menu__button">Settings</a>
              </li>
            `:``}
          </ul>
          ${viewing.toLowerCase()!=this.getPlayerName()?`
            <ul class="d-ud__top__button-menu">
                <li>
                  <a href="contacts.cgi?add=${u_id}" class="d-ud__top__button-menu__button">Add to contacts</a>
                </li>
            </ul>
            <div class="d-ud__top__list-spacer"></div>
          `:``}
          <ul class="d-ud__top__button-menu">
            ${u_id>0?`
              <li>
                <a href="profile.cgi?id=${u_id - 1}" class="d-ud__top__button-menu__button">Previous</a>
              </li>
            `:''}
            <li>
              <a href="profile.cgi?id=${u_id + 1}" class="d-ud__top__button-menu__button">Next user</a>
            </li>
          </ul>
        </div>
      `);
    }
    mapScenario() {
      c.log("Loading settings for the map page...");

      this.leftCell = document.getElementsByClassName("cp", "td")[0];
      this.cityMap = this.leftCell.getElementsByClassName("c", "table")[0];
      this.headsUpDisplay = this.leftCell.getElementsByClassName("gt", "p")[0];
      this.isDead = ((this.headsUpDisplay.innerHTML.search(/you are <b>dead<\/b>/) > -1) ?1:0);
      this.cityCells = this.cityMap.getElementsByTagName("td");
      this.gameText = document.getElementsByClassName("gp", "td")[0];
			this.actionForms = this.gameText.getElementsByClassName("a", "form");

      let isinvCarrotOpen = false;

      this.showGPS = true;

      //get player ID for later
      this.p_id = document.querySelector(".cp .gt a").href.split("id=").pop();
      localStorage.setItem('user_ID', this.p_id);

      //enable pretty map
      document.body.classList.toggle("pretty-map");
      //add classes to special blocks
      this.specialBlocks();

      //enable graphical stats
      this.graphicalStats();

      c.log("Loading inventory...");
      try {
        this.inventory(isinvCarrotOpen);
      }
      catch(e) {
        c.log(e);
      }
    }
    skillsScenario() {
      c.log("Loading settings for the skills page...");

      //draw the new, better header
      this.drawHeader(page);

      //hide the bottom nav
      document.querySelectorAll("a.y[href='map.cgi']").forEach(function (e) {
        if (e.parentElement.nodeName == "P") e.parentElement.style.display = 'none';
        else e.style.display = 'none';
      });
    }
    profileScenario(page) {
      c.log("Loading settings for the profile page...");

      //draw the new, better header
      this.drawHeader(page);

      //hide the bottom nav
      document.querySelector("a.y[href='map.cgi']").parentElement.style.display = 'none';
    }
    do(page) {
      switch (page) {
        case 'profile.cgi':
          this.profileScenario(page);
          break;
        case 'map.cgi':
          this.mapScenario(page);
          break;
        case 'skills.cgi':
          this.skillsScenario(page);
          break;
        default: return;
      }
    }
  }

  const ud = new UrbanDead({
    doc: document
  });

  let page = window.location.pathname.substring(1);

  ud.do(page);
})();
