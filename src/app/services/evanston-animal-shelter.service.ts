import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChromeStorageService } from './chrome-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EvanstonAnimalShelterService {

  constructor(private http: HttpClient, private chromeStorageService: ChromeStorageService) { }

  proxyUrl: string = 'https://cors-anywhere.herokuapp.com/';
  url: string = 'http://evanstonanimalshelter.net';

  petTypeMapping = {  dog: '/adopt-a-dog/', 
                      cat: '/adopt-a-cat/' }

  getPets(type) {
    if (type == 'all') {
      var catsAndDogs = [];
      return new Promise((resolve, reject) => {
        this.getSpecificPets('dog').then(value => {
          this.getSpecificPets('cat').then(value2 => {
            resolve(catsAndDogs.concat(value).concat(value2));
          });
        });
      });
    } else {
      return this.getSpecificPets(type);
    }    
  }

  getSpecificPets(type) {
    var resolvedLink = this.resolveShelterUrl(type, true);
    return new Promise((resolve, reject) => {
      if (resolvedLink != null) {
        this.http.get(resolvedLink, { responseType: 'text',
                                      headers: {'X-Requested-With': 'chrome'} 
                                    }).subscribe(data => {

          var DomParser = require('dom-parser');
          var parser = new DomParser();
          var httpDoc = parser.parseFromString(data,"text/html");
  
          var petName = httpDoc.getElementById('adoptdogscats').getElementsByTagName('h2'); 
          var petDoms = httpDoc.getElementById('adoptdogscats').getElementsByClassName('flexslider');
  
          var petIdList = [];
          var pets = [];
          var i = 0;
          for (i; i < petDoms.length; i++) {
  
            var pet = {};
  
            pet['name'] = this.htmlDecode(petName[i].innerHTML);
            pet['id'] = petDoms[i].attributes[0].value;
            pet['img'] = petDoms[i].getElementsByTagName('img')[0].attributes[2].value;
            pet['status'] = '';
            pet['site'] = this.resolveShelterUrl(type, false) + '#' + pet['id'];
            petIdList.push(pet['id']);
  
            pets.push(pet);
          }
  
          resolve(this.chromeStorageService.updateWatchHistory(petIdList, pets));
        });
      } else {
        resolve([]);
      }
    });
  }

  resolveShelterUrl(type, proxy) {
    var resolvedUrl = this.petTypeMapping[type];
    if (resolvedUrl) {
      if (proxy) {
        resolvedUrl = this.proxyUrl + this.url + resolvedUrl;
      } else {
        resolvedUrl = this.url + resolvedUrl;
      }
    }
    return resolvedUrl;
  }

  htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
  }

}
