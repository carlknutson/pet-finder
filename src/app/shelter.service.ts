import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ShelterService {

  constructor(private http: HttpClient) { }
  test() {
    console.log("hello");
  }

  parseShelter(link) {
    var pets = [];

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

      chrome.storage.local.get(petIdList, function(result) {
        console.log(result);

        var unwatchedPets = [];

        for (var i = 0; i < dirtyPets.length; i++) {
            switch(result[dirtyPets[i].id]) {
              case "D":
                break;
              case "W":
                dirtyPets[i].status = "W";
                pets.push(dirtyPets[i]);
                break;
              default:
                unwatchedPets.push(dirtyPets[i]);
            }
        }
        pets = pets.concat(unwatchedPets);
        console.log("Pet Counter: " + pets.length)

        // self.changeDetectorRef.detectChanges();
      });

      // loop through list adding non-D pets into the main viewing list
      // ensure model is updated
      // needed to notify of model changes
    });

    console.log("Pet Counter: " + pets.length)
    return pets;
  }
}
