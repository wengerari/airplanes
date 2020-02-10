
const R = 6371;

const INITIAL_LAT = 55.410307;
const INITIAL_LON = 37.902451;


let dataAirplanes =[];

const dataPreview = document.getElementById("data-preview");



const getData = async () => {
    return fetch("https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48").then(response => response.json());
}



async function getStarted(){
    
    while(dataPreview.firstChild){
        dataPreview.removeChild(dataPreview.firstChild);
    }

    
    await getData().then(data => Object.keys(data).map(key => {
        if(Array.isArray(data[key])){
          
          
     
          function getDistanceInKm(lat1,lon1,lat2,lon2) {
             const dLat = (lat2-lat1)* (Math.PI/180);  
             const dLon = (lon2-lon1)* (Math.PI/180); 
             const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1* (Math.PI/180)) * Math.cos(lat2* (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
             const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
             const d = R * c; 
             return d;
           }
     
           const currentDistance = getDistanceInKm(INITIAL_LAT,INITIAL_LON,data[key][1],data[key][2]);
           
           const obj= {
               distance: currentDistance,
               latitude: data[key][1],
               longitude: data[key][2],
               speed: data[key][5],
               course: data[key][3],
               altitude: data[key][6],
               code1: data[key][11],
               code2: data[key][12],
               number: data[key][13]
             };
             dataAirplanes.push(obj);
        }


        
        
     }));

     

     dataAirplanes.sort((a,b) =>{
        if(a.distance > b.distance){
            return 1;
        }
        if(a.distance < b.distance){
            return -1;
        }
        return 0;
    })
     
   
    dataAirplanes.map(item => {
        
        const dataLine = document.createElement("div");
        dataLine.className= "data-line";
        dataLine.innerHTML=
            `<div>${item.distance.toFixed(3)}</div>
            <div>${item.latitude}</div>
            <div>${item.longitude}</div>
            <div>${item.speed}</div>
            <div>${item.course}</div>
            <div>${item.altitude}</div>
            <div>${item.code1}</div>
            <div>${item.code2}</div>
            <div>${item.number}</div>`;
        
          
    
        dataPreview.append(dataLine);
    });
    
    dataAirplanes=[];
     
}



getStarted();

setInterval(()=>{
    getStarted();
}, 4000);