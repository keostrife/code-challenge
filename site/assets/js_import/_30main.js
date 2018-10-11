{
	let _app = {};

	_app.init = () => {
		for(let i in _app) {
			if (_app[i].init) _app[i].init();
		}
	}

	_app.queryString = () => {
		let string = window.location.search.substr(1).split('&');
	    if (string == "") return {};
	    let data = {};
	    for (let pair of string) {
	    	pair=pair.split('=', 2);
	    	if (pair.length == 1)
	    	    data[pair[0]] = "";
	    	else
	    	    data[pair[0]] = decodeURIComponent(pair[1].replace(/\+/g, " "));
	    }
	    return data;
	}


	window.onload = ()=>{
		_app.init();
	}

	window.App = _app;
}