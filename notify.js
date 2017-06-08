function notify(msg) {
	options = {TemplateType: "basic"};
	options["iconUrl"] = "https://v3rmillion.net/favicon.ico";
	options["title"] = "V3rmillion";
	options["message"] = msg;
	chrome.notifications.create(options, function(id) {
		setTimeout(chrome.notifications.clear(id), 5000);
	});
}

function parseDate(date) {
	var dat = date.exec(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/);
	var date = new Date(Date.UTC(dat[1], dat[2]-1, dat[3], dat[4],dat[5],dat[6]));
	return date.getTime() / 1000;
}

var lastpost = 0;

function check(id) {
	var feed = "https://v3rmillion.net/syndication.php";
	$.get(feed, {fid: id, limit: 1, type: "atom1.0"}, function(data) {
		var post = $.parseXML(data).find("entry");
		var published = post.find("published").html();
		published = parseDate(published);
		if(published > lastpost) {
			var title = post.find("title").html();
			lastpost = published;
			notify("New post in Lounge: " + title);
		}
	});
}
