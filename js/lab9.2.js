document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([40.1634608, -105.100107], 14);
    map.zoomControl.setPosition('topright');
    
    L.tileLayer('https://api.mapbox.com/styles/v1/jack-hardwick/cjef3ijq04jh82snpvezi7ydo/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFjay1oYXJkd2ljayIsImEiOiJjamVmMmFhc2IxemQxMnBsbmI1dW5qbjg5In0.LA81ed1j-W5il_-0zUm1zA', 
                {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(map);  
    
    var list = document.getElementById("list");
    var siteList = [];
    
    var sites = L.esri.featureLayer({
        url: 'https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/latlongsites/FeatureServer/0',
        
        
      
        onEachFeature: myOnEachFeature
        
        /*
        pointToLayer: function (feature) {
            var btn = document.createElement("BUTTON");
            var content = document.createTextNode(feature.properties.Name);
            //btn.setAttribute("id", feature.properties.Name);
            btn.setAttribute("class", "siteButton")
            btn.appendChild(content);
            document.getElementById("container").appendChild(btn);
            console.log(feature.properties.Name);
            */
        
    }).addTo(map);

    
    function myOnEachFeature(feature, layer) {
    var li = document.createElement("li"),
        a = document.createElement("Button"),
        content = feature.properties.Name;
        siteList.push({No: feature.properties.No, Name:feature.properties.Name, Location: feature.properties.Location, Date: feature.properties.Date, Year_Desig: feature.properties.Year_Desig, webpage: feature.properties.WEB, Lat: feature.properties.Lat, Long: feature.properties.Long, imgSrc: feature.properties.img_Src})
        
    // Create the "button".
        
    a.innerHTML = content;
    a.layer = layer; // Store a reference to the actual layer.
    a.onclick = function myFunction()
        {
            var siteNum = a.layer.feature.properties.No;
            document.getElementById("cardText").href = a.layer.feature.properties.WEB;
            document.getElementById("cardText").innerHTML = a.layer.feature.properties.WEB;
            if(a.layer.feature.properties.img_Src == "")
                {
                   document.getElementById("sitePic").alt = "No Picture Available!"; 
                }
            else{
                document.getElementById("sitePic").src =a.layer.feature.properties.img_Src;
                document.getElementById("sitePic").alt = a.layer.feature.properties.Name;
            } 
            var siteLoc = L.latLng(a.layer.feature.properties.Lat, a.layer.feature.properties.Long);
            map.flyTo(siteLoc, 18);
            var popup = L.popup()
            .setLatLng(siteLoc)
            .setContent(a.layer.feature.properties.Name)
            .openOn(map);
        }
    
      /*
        a.onclick = function (event) {
        event.preventDefault(); // Prevent the link from scrolling the page.
        //map.flyToBounds(feature.geometry.coordinates);
        
        var siteLoc = L.latLng(a.layer.feature.properties.Lat, a.layer.feature.properties.Long);
        //map.setVeiw(siteLoc, 16);
        //console.log(feature.properties);
        document.getElementByClassName("container").innerHTML = feature.properties.webpage;
        layer.openPopup();
    };
    */
        
    li.appendChild(a);
    list.appendChild(li);
    
    console.log(siteList);
    layer.bindPopup("Name: " + content + "Lat:" + feature.properties.Lat + " Long: " + feature.properties.Long + " Image Source: " + feature.properties.img_Src);
    
}

    function onMapClick(e) 
    {
        var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent("<center><img src='http://dev.brightrain.com/recreationer/images/icon-map-marker.png'></center><h4>" + e.latlng.lat + " | " + e.latlng.lng + "</h4>")
        .openOn(map);
    }
    map.on('click', onMapClick);
    
    sites.onclick = function clickedFeature()
    {
            var siteNum = sites.properties.No;
            document.getElementById("cardText").href = sites.properties.WEB;
            document.getElementById("cardText").innerHTML = sites.properties.WEB;
            if(sites.properties.img_Src == "")
                {
                   document.getElementById("sitePic").alt = "No Picture Available!"; 
                }
            else{
                document.getElementById("sitePic").src =sites.properties.img_Src;
                document.getElementById("sitePic").alt = sites.properties.Name;
            } 
            
    }



});