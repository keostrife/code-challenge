App.country_search = {
	apiUrl: "https://jsonmock.hackerrank.com/api/countries/search",
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
	//function declaration here to preserve this scope
	formHandler: function(e){
		e.preventDefault();
		let s = this.country_search.value || alert(this.getAttribute("data-errorMsg"));
		if(s) App.country_search.search(s);
	},
	filter: (item)=>{
		return (item.population && item.population < maxPopulation);
	},
	search: (s)=>{
		//updating history
		let query = App.queryString();
		let page = query["page"] || 1;
		if(query.s != s) {
			query.s = s;
			//make sure pagination nav links have correct querystring
			App.country_search.pagination.query = query;
			App.country_search.updateHistory(s);
		}

		//this is equavilent of getCountries() function
		return fetch(`${App.country_search.apiURL}?name=${s}&page=${page}`)
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
		//these values will get updated once the data is fetched
		items: [],
		itemsPerPage: 10,
		currentPage: 1,
		pageCount: 1,
		query: App.queryString(),
		render: ()=>{
			//render all results and nav into the page
			App.country_search.pagination.renderResults();
			App.country_search.pagination.renderNav();
		},
		renderResults: ()=>{
			let resultHtml = "";

			let renderItem = (item)=>{
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

				return resultHtml;
			}

			for(let item of App.country_search.pagination.items) {
				//filter the items
				if(!App.country_search.filter(item)) continue;

				//render html
				document.querySelector("#searchResults").innerHTML  = renderItem(item);
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

				//add current class
				if(parseInt(page) == App.country_search.pagination.currentPage) {
					current = ' active';
					link = '#';
				}

				return `<li class="page-item${current}"><a class="page-link" href="${link}">${page}</a></li>`;
			}


			let navHtml = '';
			let prevBtn = renderNavItem("previous");
			let nextBtn = renderNavItem("next");

			//remove previous/next button if necessary
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