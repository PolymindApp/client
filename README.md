<p align="center"><a href="https://www.polymind.app" target="_blank"><img src="https://raw.githubusercontent.com/PolymindApp/client/master/resources/app/assets/images/polymind-dark.svg" width="80"></a></p>

## About

Polymind is a free and open-source program to practice memorization at the subconscious level.

#### Useful for:

- Language learning
- Practice for exams
- Studying for medical and law exams
- Memorize long lists of information

### Technology

Written in PHP and JavaScript, it uses Laravel, VueJS and Vuetify as frameworks.

## Installation

### Setup your environment

1) Create a copy of ```.env.example```, name it ```.env``` and adjust the settings according to your current setup.
2) Run ```composer install``` in the root directory.
3) Run ```npm install``` or ```yarn``` in the root directory.
4) Run the following commands to initiate the database:
```
php artisan migrate:fresh
php artisan db:seed --class=LanguageSeeder
php artisan db:seed --class=VoiceSeeder
```
5) Run ```npm run build```.

### Setup AWS

1) Create a new IAM user of type ```Programmatic access```.
2) Attach the existing policy ```AmazonPollyFullAccess``` to the user.
3) Copy-paste the access and secret key into your ```.env``` file.

### Setup ambiences

You can easily add your custom ambiences by creating a  ```.ambience.json``` file at the root folder of the project.

The structure of the JSON file is an array containing the following properties:

```json
[{
    "title": "My ambience",
    "url": "https://website.com/music.mp3",
    "bg": "https://website.com/background.jpg",
    "thumbnail": "https://website.com/thumbnail.jpg",
    "opacity": 0.75,
    "volume": 0.2
}]
```

### Launch the application

In your terminal, run:
```
php artisan serve
```

If you want to make modifications to the UI, also run:
```
npm run hot
```

## License

The Polymind web app is open-sourced software licensed under the [BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause).
