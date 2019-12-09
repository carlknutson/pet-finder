import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DOMParser } from 'dom-parser';
import { ShelterService } from './shelter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PetWatch';

  constructor(private changeDetectorRef: ChangeDetectorRef, private shelterService: ShelterService){ }

  pets = [];

  selectedType: string;

  // filter lists
  filterListTypes = [
    {value: '', viewValue: 'All Types'},
    {value: 'animal_type%3ADog', viewValue: 'Dog'},
    {value: 'animal_type%3ACat', viewValue: 'Cat'},
    {value: 'animal_type%3ASmall%26Furry', viewValue: 'Other Small Animals'},
  ];

  openPetInfo(id) {
    window.open("https://www.animalhumanesociety.org/" + id, "_blank");
  };

  ngOnInit() {
    this.shelterService.test();
    var self = this;
    chrome.storage.local.get(['filter_type'], function(result) {
      var cachedType = result['filter_type'];
      if (cachedType == null) {
        console.log('filter_type is empty');
      } else {
        console.log('filter_type has a value of: ' + cachedType);
        self.selectedType = cachedType;
      }
      self.petFilterChange();
    });
  };

  // new request
  petFilterChange() {
    var obj = {};
    obj['filter_type'] = this.selectedType;

    chrome.storage.local.set(obj, function() {
      console.log(obj);
    });

    var link = 'https://www.animalhumanesociety.org/adoption';
    if (this.selectedType) {
      link = link + '?f%5B0%5D=' + this.selectedType;
    } else {
      console.log("not true: " + this.selectedType);
    }
    this.pets = this.shelterService.parseShelter(link);
  };

  hidePet(index, id) {
    var obj = {};
    obj[id] = "D";

    chrome.storage.local.set(obj, function() {
      console.log(obj);
    });

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

    // update data model value for css
    this.pets[index].status = newStatus;

    // needed to notify of model changes
    this.changeDetectorRef.detectChanges();
  }

}
