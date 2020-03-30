import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChromeStorageService } from './chrome-storage.service';
import { PETFINDER_CLIENT_ID, PETFINDER_CLIENT_SECRET } from '../api-constants';
@Injectable({
  providedIn: 'root'
})
export class PetfinderApiService {

  constructor(private http: HttpClient, private chromeStorageService: ChromeStorageService) { }

  petTypeMapping = {  dog: 'Dog', 
                      cat: 'Cat' }

  token: string;

  getPets(zip: string, type: string) {

    var link = this.resolveShelterUrl(zip, type);

    return new Promise((resolve, reject) => {

      this.getToken().then(headerObj => {

        this.http.get(link, headerObj).subscribe((data: object) => {
            var pets = [];
            var petIdList = [];

            var apiPets = data['animals'];

            var i = 0;
            for (i; i < apiPets.length; i++) {

              var pet = {};

              pet['name'] = this.cleanName(apiPets[i].name);
              pet['id'] = String(apiPets[i].id);

              if (apiPets[i].photos.length > 0) {
                pet['img'] = apiPets[i].photos[0].medium;
              } else {
                // if no photo of dog, use public domain image
                pet ['img'] = '../assets/dog-using-laptop-computer.jpg'
              }
              pet['status'] = '';
              pet['site'] = apiPets[i].url;

              petIdList.push(pet['id']);
              pets.push(pet);
            }

            resolve(this.chromeStorageService.updateWatchHistory(petIdList, pets));
        },
        error => {
          console.error("error retrieving pets in petfinder, resolving to empty list");
          reject();
        }
        );
      });
    });
  }

  resolveShelterUrl(zip: string, type: string) {
    if (type == 'all') {
      return 'https://api.petfinder.com/v2/animals?location=' + zip + '&sort=distance&limit=25';
    } else {
      return 'https://api.petfinder.com/v2/animals?type=' + this.petTypeMapping[type] + '&location=' + zip + '&sort=distance&limit=25';
    }
  }

  cleanName(name: string) {
    var cleanName: string = name;

    if (name.length > 21) {
      cleanName = name.slice(0, 19) + '...';
    }

    return cleanName;
  }

  getToken() {
    return new Promise((resolve, reject) => {
      if (this.token) {

        // TODO: look into logic to determine if time has expired token, if so
        console.log("using stored token");
        resolve({headers: new HttpHeaders().set("Authorization", "Bearer " + this.token)});
      } else {
        console.log("grabbing new token");
        let body = new URLSearchParams();
        body.set('grant_type', 'client_credentials');
        body.set('client_id', PETFINDER_CLIENT_ID);
        body.set('client_secret', PETFINDER_CLIENT_SECRET);
    
        let options = {
          headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };
    
        this.http
          .post('https://api.petfinder.com/v2/oauth2/token', body.toString(), options)
          .subscribe(data => {
            this.token = data['access_token'];
            resolve({headers: new HttpHeaders().set("Authorization", "Bearer " + data['access_token'])});
          });
      }
    });
  }


}


