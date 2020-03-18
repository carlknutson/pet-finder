import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShelterService } from './services/shelter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PetWatch';

  constructor(private changeDetectorRef: ChangeDetectorRef, private shelterService: ShelterService){ }

  pets = [];

  selectedPetType: string;

  filterListTypes = [
    {value: '*', viewValue: 'All Types'},
    {value: 'dog', viewValue: 'Dog'},
    {value: 'cat', viewValue: 'Cat'},
    {value: 'other', viewValue: 'Other Small Animals'},
  ];

  openShelterSite(site:string) {
    window.open(site);
  };

  ngOnInit() {

    // chrome.storage.local.get(['filter_type'], result => {
    //   var cachedType = result['filter_type'];
    //   if (cachedType == null) {
    //     console.log('filter_type is empty');
    //   } else {
    //     console.log('filter_type has a value of: ' + cachedType);
    //     this.selectedPetType = cachedType;
    //   }
      this.updatePetList();
    // });
  };


  updatePetList() {

    // var obj = {};
    // obj['filter_type'] = this.selectedPetType;

    // chrome.storage.local.set(obj, function() {
    //   console.log(obj);
    // });

    this.shelterService.getPets(this.selectedPetType).then(value => {
      console.log(value);
      this.pets = [];
      this.pets = this.pets.concat(value);
      this.changeDetectorRef.detectChanges();
    })
    
  };

  hidePet(index, id) {
    // var obj = {};
    // obj[id] = "D";

    // chrome.storage.local.set(obj, function() {
    //   console.log(obj);
    // });

    this.pets.splice(index, 1);

    // needed to notify of model changes
    this.changeDetectorRef.detectChanges();
  };

  watchPetToggle(index, id, status) {
    var cachedObj = {};
    var newStatus = "";

    if (status == "") {
      newStatus = "W";
    }

    cachedObj[id] = newStatus;

    chrome.storage.local.set(cachedObj, function() {
      console.log(cachedObj);
    });

    this.pets[index].status = newStatus;
    this.changeDetectorRef.detectChanges();
    
  }

  // TODO: remove
  printCount() {
    console.log("Count of the pets: " + this.pets.length);
  }

}
