import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMParser } from 'dom-parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'petfinder';

  constructor(private http: HttpClient, private changeDetectorRef: ChangeDetectorRef){ }

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

    this.http.get(link, { responseType: 'text' }).subscribe(data => {
      // console.log(data);
      var dirtyPets = [];
      console.log("link: " + link);
      var DomParser = require('dom-parser');
      var parser = new DomParser();
      var httpDoc = parser.parseFromString(data,"text/html");
      // console.log(httpDoc);

      var petList = httpDoc.getElementsByClassName('field--name-name');
      var imageList = httpDoc.getElementsByClassName('field--name-field-main-image');

      // for each, parse out: animalID, cloudfront url, name,
      //LATER implement following: breed, sex/year, location
      var i;
      for (i = 0; i < petList.length; i++) {
        var petObj = petList[i].getElementsByTagName('a');
        var imageObj = imageList[i].getElementsByTagName('img');
        var pet = {};
        // console.log(imageObj);
        pet['name'] = petObj[0]['innerHTML'];
        pet['id'] = petObj[0].attributes[0].value;
        pet['img'] = imageObj[0].attributes[0].value;
        pet['status'] = '';
        dirtyPets.push(pet);
      }

      // create petid list and get all cached values
      var petIdList = [];
      var j;
      for (j = 0; j < dirtyPets.length; j++) {
        petIdList.push(dirtyPets[j].id);
      }

      var self = this;
      chrome.storage.local.get(petIdList, function(result) {
        console.log(result);

        var unwatchedPets = [];

        // use for watched pets
        self.pets = [];

        for (var i = 0; i < dirtyPets.length; i++) {
            switch(result[dirtyPets[i].id]) {
              case "D":
                break;
              case "W":
                dirtyPets[i].status = "W";
                self.pets.push(dirtyPets[i]);
                break;
              default:
                unwatchedPets.push(dirtyPets[i]);
            }
        }
        self.pets = self.pets.concat(unwatchedPets);

        self.changeDetectorRef.detectChanges();
      });

      // loop through list adding non-D pets into the main viewing list
      // ensure model is updated
      // needed to notify of model changes
    });
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
