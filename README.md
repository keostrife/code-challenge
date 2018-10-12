### Live URL: http://staging.sarahai.com/index.html

### Specs:

You are to create a form that utilizes bootstrap or Zurb Foundation for styling.
The form contains a text field that allows the user to enter a partial country name
There is a submit button to perform the query.

Given a substring s, and a minimum population that we are interested in (let's call it p), find the number of country names that contain the substring s that also have populations greater than p

Use the HTTP GET method to retrieve information from a database that stores countries
Query the URL https://jsonmock.hackerrank.com/api/countries/search?name=s where s is a substring that describes part of a country name. A use case would be where s = can, and the query could return American Samoa as well as Canada
Multiple countries meeting the search criteria can be returned.
The query response id paginated and can be further refined by adding &page=num where num is a page number
The query response is a JSON response with the following fields
altSpellings - alternative spellings of the country name
area - the country's area (in sq. km)
capital - the name of the country's capital
latlng - the capital's latitude and longitude
name: the country's name
population: the country's population
timezones: the country's timezones
topLevelDomain: the country's top level domain name extension
callingCodes: area codes for the country
region: The country's region
subRegion: The country's subregion
nativeName: The country's native or ancient name
languages: The languages spoken

Complete a function called getCountries() that returns the number of countries meeting criteria.
In the web page, display the respective countries and their information that match as a list, using styling of your choosing.

Constraints:

population has to greater than 1 and less than 10 billion , i.e. 1 <= p <= 10^12.

### Notes:

I didn't exactly create 1 function called getCountries(), it's kinda pointless in the context of the demo I created. 
You can find everything in ```site/assets/js_import/country_search.js```

for query string, ```s``` is for search, ```p``` is for maxPopulation, ```page``` is for page. ```maxPopulation``` is also a global variable defined in ```site/index.html```

I only use Babel for ES6 compiling. I had the impression that you wanted me to use React, but by the time I realize that I already almost finished the test. Please let me know if you want a react version of this.

Thanks!
-Keo