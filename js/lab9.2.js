document.addEventListener('DOMContentLoaded', function() {
    //create the map and set zoom controls to the upper right portion of the screen.
    var map = L.map('map').setView([40.1634608, -105.100107], 14);
    map.zoomControl.setPosition('topright');

    //import custom mapbox basemap
    L.tileLayer('https://api.mapbox.com/styles/v1/jack-hardwick/cjef3ijq04jh82snpvezi7ydo/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFjay1oYXJkd2ljayIsImEiOiJjamVmMmFhc2IxemQxMnBsbmI1dW5qbjg5In0.LA81ed1j-W5il_-0zUm1zA', 
                {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(map);  
    
    //unsure if this list element is still needed, but I am hesitant to remove anything at this point in fear of breaking it.
    var list = document.getElementById("list");
    var siteList = [];
    
    //call feature layer data from AGO
    var sites = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/latlongsites/FeatureServer/0',



        onEachFeature: myOnEachFeature


    }).addTo(map);

    //for each feature, create a button populated with the name, that onclick() flys the camera to the location of that point.
    function myOnEachFeature(feature, layer) {
        // Create the "button" and List.
        var li = document.createElement("li"),
            a = document.createElement("Button"),
            content = feature.properties.Name;
        siteList.push({No: feature.properties.No, Name:feature.properties.Name, Location: feature.properties.Location, Date: feature.properties.Date, Year_Desig: feature.properties.Year_Desig, webpage: feature.properties.WEB, Lat: feature.properties.Lat, Long: feature.properties.Long, imgSrc: feature.properties.img_Src})

        

        a.innerHTML = content;
        a.layer = layer; // Store a reference to the actual layer. This was what I should have been paying attention to. Though I swore I tried referencing this earlier with the buttons to no avail. 
        a.onclick = function myFunction()
        {
            //update the card info 
            var siteNum = a.layer.feature.properties.No;
            document.getElementById("cardText").href = a.layer.feature.properties.WEB;
            document.getElementById("cardText").innerHTML = a.layer.feature.properties.WEB;
            console.log("Clicked " + a.layer.feature.properties.Name);
            //A number of the sites do not have images currently available. This just makes the alt text that shows up in the empty box a littl more relavent. 
            if(a.layer.feature.properties.img_Src == "No Picture Available!")
            {
                document.getElementById("sitePic").alt = "No Picture Available!"; 
            }
            else{
                document.getElementById("sitePic").src =a.layer.feature.properties.img_Src;
                document.getElementById("sitePic").alt = a.layer.feature.properties.Name;
            } 
            var siteLoc = L.latLng(a.layer.feature.properties.Lat, a.layer.feature.properties.Long);
            map.flyTo(siteLoc, 18);
            
            
            
            //The popup doesn't want to work for whatever reason... Should open a popup on button click. Tried multiple permutations. Probably a dumb mistake somewhere. Now even having this code uncommented
            //will lead to a critical error resulting in nothing displaying on the map at all. Apparently there is an unexpected token??
            
            //var popup = L.popup();
            //.setLatLng(siteLoc)
            //.setcontent("Site: " + a.layer.feature.properties.Name)
            //.openPopup(popup)
            //According to the Leaflet documentation, the four lines above should be all I need. 
        }

        //add the newly created button to the list
        li.appendChild(a);
        list.appendChild(li);

        console.log(siteList);
        layer.bindPopup("<h3>Name: " + content + "</h3><h3>Lat:" + feature.properties.Lat + "\n Long: " + feature.properties.Long + "</h3><img style=width:100px src='" + feature.properties.img_Src + "'>");

    }
    
    //extra function that I like, Maybe not entirely necessary however..
    //though it does function as a closePopup() feature. This means any click off screen will close any other opened popups. Unitentional but I like it.
    function onMapClick(e) 
    {
        var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent("<center><img src='http://dev.brightrain.com/recreationer/images/icon-map-marker.png'></center><h4>" + e.latlng.lat + " | " + e.latlng.lng + "</h4>")
        .openOn(map);
    }
    map.on('click', onMapClick);

   



});