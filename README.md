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

1) Create a copy of ```.env.example``` and name it ```.env```. Adjust the settings according to your current setup.
2) Run ```composer install``` in the root directory.
3) Run ```npm install``` or ```yarn``` in the root directory.
4) Run ```php artisan migrate``` in order to create the database.

### Launch the application

In your terminal, run:
```
php artisan serve
```

If you want to make modifications to the UI, also run:
```
npm run hot
# or yarn hot
```

## License

The Polymind web app is open-sourced software licensed under the [BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause).
