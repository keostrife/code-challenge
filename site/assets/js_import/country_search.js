App.country_search = {
	init: () => {
		let form = document.querySelector("#myForm");
		let queryString = App.queryString();

		form.onsubmit = App.country_search.formHandler;

		//if s is in query string search right away
		if(queryString["s"]) {
			form.country_search.value = queryString["s"];
			if(queryString["p"]) maxPopulation = parseInt(queryString["p"]);
			App.country_search.search(queryString["s"]);
		}
	},
	updateHistory: (search)=>{
		history.pushState({}, "", window.location.pathname+"?s="+search);
	},
	formHandler: function(e){
		e.preventDefault();
		let s = this.country_search.value || alert("please enter a search value");
		if(s) {
			App.country_search.search(s);
		}
		
	},
	filter: (item)=>{
		if(item && item.population && item.population > 1 && item.population < maxPopulation) return true;
		return false;
	},
	search: (s)=>{
		//updating history
		let query = App.queryString();
		let page = query["page"] || 1;
		if(query.s != s) {
			query.s = s;
			App.country_search.pagination.query = query;
			App.country_search.updateHistory(s);
		}

		return fetch(`https://jsonmock.hackerrank.com/api/countries/search?name=${s}&page=${page}`)
			.then((res)=>{return res.json()})
			.then((data)=>{
				let pagination = App.country_search.pagination;
				pagination.items = data.data;
				pagination.itemsPerPage = data.per_page;
				pagination.pageCount = data.total_pages;
				pagination.currentPage = data.page;
				pagination.render();
			});
	},
	pagination: {
		items: [],
		itemsPerPage: 10,
		currentPage: 1,
		pageCount: 1,
		query: App.queryString(),
		render: ()=>{
			App.country_search.pagination.renderResults();
			App.country_search.pagination.renderNav();
		},
		renderResults: ()=>{
			let resultHtml = "";
			for(let item of App.country_search.pagination.items) {
				if(!App.country_search.filter(item)) continue;
				resultHtml += "<li>";
				resultHtml += `<a data-toggle="collapse" href="#panel-${item.alpha3Code}" role="button" aria-expanded="false" aria-controls="panel-${item.alpha3Code}">${item.name}</a>`;
				resultHtml += `<div class="collapse" id="panel-${item.alpha3Code}">
				  <div class="card card-body">
				    Alternative Spellings: ${item.altSpellings.join(', ')} <br>
				    Area: ${item.area} (sq. km) <br>
				    Capital: ${item.capital} <br>
				    Lat and Lng: ${item.latlng.join(", ")} <br>
				    Name: ${item.name} <br>
				    Population: ${item.population} <br>
				    Timezones: ${item.timezones.join(", ")} <br>
				    Top Level Domain Name Extensions: ${item.topLevelDomain.join(", ")} <br>
				    Calling Code: ${item.callingCodes.join(", ")} <br>
				    Region: ${item.region} <br>
				    Subregion: ${item.subregion} <br>
				    Native Name: ${item.nativeName} <br>
				    Languages: ${item.languages.join(", ")} 
				  </div>
				</div>`;
				resultHtml += "</li>";
				document.querySelector("#searchResults").innerHTML  = resultHtml;
			}
		},
		renderNav: ()=>{
			let renderNavItem = (page)=>{
				let current = '';

				//maintain the current querystring for nav links
				let query = JSON.parse(JSON.stringify(App.country_search.pagination.query));
				query.page = parseInt(page);
				if(page=="previous") query.page = parseInt(App.country_search.pagination.currentPage)-1;
				if(page=="next") query.page = parseInt(App.country_search.pagination.currentPage)+1;

				let queryString = [];
				for(let key in query) {
					queryString.push(key+"="+query[key]);
				}
				let link = window.location.pathname+"?"+queryString.join("&");
				if(parseInt(page) == App.country_search.pagination.currentPage) {
					current = ' active';
					link = '#';
				}

				return `<li class="page-item${current}"><a class="page-link" href="${link}">${page}</a></li>`;
			}
			let navHtml = '';
			let prevBtn = renderNavItem("previous");
			let nextBtn = renderNavItem("next");
			if(App.country_search.pagination.currentPage == 1) prevBtn = '';
			if(App.country_search.pagination.currentPage == App.country_search.pagination.pageCount) nextBtn = '';

			navHtml += prevBtn;
			if(App.country_search.pagination.pageCount > 1)
				for(let page = 1; page <= App.country_search.pagination.pageCount; page++) {
					navHtml += renderNavItem(page);
				}
			navHtml += nextBtn;

			document.querySelector("#searchNav").innerHTML  = navHtml;
		}
	}
}