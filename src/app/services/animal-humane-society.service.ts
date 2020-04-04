// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { ChromeStorageService } from './chrome-storage.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AnimalHumaneSocietyService {

//   constructor(private http: HttpClient, private chromeStorageService: ChromeStorageService) { }

//   url: string = 'https://www.animalhumanesociety.org';

//   petTypeMapping = {  all: '',
//                       dog: 'animal_type%3ADog',
//                       cat: 'animal_type%3ACat',
//                       other: 'animal_type%3ASmall%26Furry'  }

//   getPets(type) {

//     var link = this.resolveShelterUrl(type);

//     return new Promise((resolve, reject) => {
//       this.http.get(link, { responseType: 'text' }).subscribe(data => {

//         var dirtyPets = [];
//         var petIdList = [];

//         var DomParser = require('dom-parser');
//         var parser = new DomParser();
//         var httpDoc = parser.parseFromString(data,"text/html");

//         var petList = httpDoc.getElementsByClassName('field--name-name');
//         var imageList = httpDoc.getElementsByClassName('field--name-field-main-image');

//         // for each, parse out: animalID, cloudfront url, name,
//         //LATER implement following: breed, sex/year, location
//         var i;
//         for (i = 0; i < petList.length; i++) {
//           var petObj = petList[i].getElementsByTagName('a');
//           var imageObj = imageList[i].getElementsByTagName('img');
//           var pet = {};

//           pet['name'] = petObj[0]['innerHTML'];
//           pet['id'] = petObj[0].attributes[0].value;
//           pet['img'] = imageObj[0].attributes[0].value;
//           pet['status'] = '';
//           pet['site'] = this.url + petObj[0].attributes[0].value;
//           dirtyPets.push(pet);
//           petIdList.push(pet['id']);
//         }

//         resolve(this.chromeStorageService.updateWatchHistory(petIdList, dirtyPets));
//       });
//     });
//   }

//   resolveShelterUrl(type) {
//     return this.url + '/adoption?f%5B0%5D=' + this.petTypeMapping[type];
//   }

// }
