import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChromeStorageService } from './chrome-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PetfinderApiService {

  constructor(private http: HttpClient, private chromeStorageService: ChromeStorageService) { }

  getPets(type) {
    return new Promise((resolve, reject) => {

      this.getToken().then(headerObj => {

        this.http.get('https://api.petfinder.com/v2/animals?type=Dog&location=60202&sort=distance&limit=100', headerObj).subscribe((data: object) => {
          console.log(data);

            var pets = [];
            var petIdList = [];

            var apiPets = data['animals'];

            var i = 0;
            for (i; i < apiPets.length; i++) {

              var pet = {};

              pet['name'] = this.cleanName(apiPets[i].name);
              pet['id'] = String(apiPets[i].id);
              pet['img'] = apiPets[i].photos[0].medium;
              pet['status'] = '';
              pet['site'] = apiPets[i].url;

              petIdList.push(pet['id']);
              pets.push(pet);
            }

            console.log(petIdList);
            console.log(pets);

            resolve(this.chromeStorageService.updateWatchHistory(petIdList, pets));
        });
      });
    });
  }

  // TODO: helper for other shelters?
  cleanName(name: string) {
    var cleanName: string = name;

    if (name.length > 21) {
      cleanName = name.slice(0, 19) + '...';
    }

    return cleanName;
  }

  // TODO: token service, give back non-expired, otherwise make new token
  getToken() {
    return new Promise((resolve, reject) => {
      let body = new URLSearchParams();
      body.set('grant_type', 'client_credentials');
      body.set('client_id', '-');
      body.set('client_secret', '-');
  
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      };
  
      this.http
        .post('https://api.petfinder.com/v2/oauth2/token', body.toString(), options)
        .subscribe(data => {
          console.log(data);
          resolve({headers: new HttpHeaders().set("Authorization", "Bearer " + data['access_token'])});
        });
    });
    
  }


}


