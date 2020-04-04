import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ChromeStorageService } from "./chrome-storage.service";
import { PETFINDER_CLIENT_ID, PETFINDER_CLIENT_SECRET } from "../api-constants";
@Injectable({
	providedIn: "root",
})
export class PetfinderApiService {
	constructor(private http: HttpClient, private chromeStorageService: ChromeStorageService) {}

	petTypeMapping = { dog: "Dog", cat: "Cat" };

	token: string;

	unwatchedPets: object[] = [];
	watchedPets: object[] = [];

	getPets(zip: string, type: string, page: number) {
		const link = this.resolveShelterUrl(zip, type, page);

		return new Promise((resolve, reject) => {
			this.getToken().then((headerObj) => {
				this.http.get(link, headerObj).subscribe(
					(data: any) => {
						const pets = [];
						const petIdList = [];

						const apiPets = data.animals;

						let i = 0;
						for (i; i < apiPets.length; i++) {
							const pet: any = {};

							pet.name = this.cleanName(apiPets[i].name);
							pet.type = apiPets[i].type.toLowerCase();
							pet.id = String(apiPets[i].id);

							if (apiPets[i].photos.length > 0) {
								pet.img = apiPets[i].photos[0].medium;
							} else {
								// if no photo of dog, use public domain image
								pet.img = "../assets/dog-using-laptop-computer.jpg";
							}
							pet.status = "";
							pet.site = apiPets[i].url;

							petIdList.push(pet.id);
							pets.push(pet);
						}

						this.chromeStorageService.updateWatchHistory(petIdList, pets).then((newUnwatchedPets: object[]) => {
							this.unwatchedPets = this.unwatchedPets.concat(newUnwatchedPets);
							const totalPages = data.pagination.total_pages;

							if (this.unwatchedPets.length + this.watchedPets.length < 50 && page !== totalPages) {
								const increasePage = page + 1;
								resolve(this.getPets(zip, type, increasePage));
							} else {
								resolve(this.watchedPets.concat(this.unwatchedPets));
								this.watchedPets = [];
								this.unwatchedPets = [];
							}
						});
					},
					(error) => {
						console.error("error retrieving pets in petfinder, resolving to empty list");
						reject();
					}
				);
			});
		});
	}

	resolveShelterUrl(zip: string, type: string, page: number) {
		if (type === "all") {
			return "https://api.petfinder.com/v2/animals?location=" + zip + "&sort=distance&limit=50&page=" + page;
		} else {
			return (
				"https://api.petfinder.com/v2/animals?type=" +
				this.petTypeMapping[type] +
				"&location=" +
				zip +
				"&sort=distance&limit=50&page=" +
				page
			);
		}
	}

	cleanName(name: string) {
		let cleanName: string = name;

		if (name.length > 21) {
			cleanName = name.slice(0, 19) + "...";
		}

		return cleanName;
	}

	getToken() {
		return new Promise((resolve, reject) => {
			if (this.token) {
				// TODO: look into logic to determine if time has expired token, if so
				console.log("using stored token");
				resolve({
					headers: new HttpHeaders().set("Authorization", "Bearer " + this.token),
				});
			} else {
				console.log("grabbing new token");
				const body = new URLSearchParams();
				body.set("grant_type", "client_credentials");
				body.set("client_id", PETFINDER_CLIENT_ID);
				body.set("client_secret", PETFINDER_CLIENT_SECRET);

				const options = {
					headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded"),
				};

				this.http.post("https://api.petfinder.com/v2/oauth2/token", body.toString(), options).subscribe((data: any) => {
					this.token = data.access_token;
					resolve({
						headers: new HttpHeaders().set("Authorization", "Bearer " + data.access_token),
					});
				});
			}
		});
	}
}
