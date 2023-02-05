import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit  {

  @ViewChild("mapContainer", { static: false }) gmap!: ElementRef;
  map!: google.maps.Map;
  form!: FormGroup;
  lat = 40.73061;
  lng = -73.935242;
  constructor(private fb: FormBuilder){}
  ngOnInit(): void {
    this.form = this.fb.group({
      slatitude: [0, Validators.required],
      slongitude: [0, Validators.required],
      marker1:['',Validators.required]
    });
  }
  markers:any = []

  //Coordinates to set the center of the map
  coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8
  };

  //Default Marker
  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
    title: "Hello World!"
  });

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    //Adding Click event to default marker
    this.marker.addListener("click", () => {
      const infoWindow = new google.maps.InfoWindow({
        content: this.marker.getTitle() || undefined
      });
      infoWindow.open(this.marker.getMap() || undefined, this.marker);
    });

    //Adding default marker to map
    this.marker.setMap(this.map);

    //Adding other markers
    this.loadAllMarkers();
  }

  loadAllMarkers(): void {
    if(this.markers.length){
    this.markers.forEach((markerInfo: google.maps.ReadonlyMarkerOptions | undefined) => {
      //Creating a new marker object
      const marker = new google.maps.Marker({
        ...markerInfo
      });

      //creating a new info window with markers info
      const infoWindow = new google.maps.InfoWindow({
        content: marker.getTitle() || undefined
      });

      //Add click event to open info window on marker
      marker.addListener("click", () => {
        infoWindow.open(marker.getMap() || undefined, marker);
      });

      //Adding marker to google map
      marker.setMap(this.map);
    });
  }
  }
  onSubmit(){
    let slatitude = this.form.value.slatitude;
    let slongitude = this.form.value.slongitude;
    let marker1 = this.form.value.marker1;
    let sCoordinates = new google.maps.LatLng(slatitude, slongitude);
    this.markers.push(
      {
        position: sCoordinates,
        map: this.map,
        title: marker1
      },
    )
    this.form = this.fb.group({
      slatitude: [0, Validators.required],
      slongitude: [0, Validators.required],
      marker1:['',Validators.required]
    });
    // this.mapInitializer()
  }
  simulate(){
    this.mapInitializer();
    for(let i=0;i<this.markers.length-1;i++){
    var line = new google.maps.Polyline({
      path: [
          new google.maps.LatLng(this.markers[i].position),
          new google.maps.LatLng(this.markers[i+1].position)
      ],
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: this.map
  });
}
this.markers=[];
  }
}
