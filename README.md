# Pokémon Evolution Advisor

A small website that helps users decide whether to evolve a Pokémon by comparing its base statistics with those of its direct evolution.

## Live website

https://sindijav.github.io/pokemon-evolution-advisor/ 

## Features

- Select a Pokémon from a dropdown
- Find its direct evolution using the supplied dataset
- Display images of the current and evolved Pokémon
- Compare HP, attack, defense, special attack, special defense, and speed
- Calculate the change in total base statistics
- Provide a clear recommendation
- Handle Pokémon without a direct evolution
- Hide unavailable images
- Work on desktop and mobile screen sizes

## How the recommendation works

The application adds together six base statistics:

- HP
- Attack
- Defense
- Special attack
- Special defense
- Speed

It compares the current Pokémon's total with the total of its direct evolution. When the evolved Pokémon has higher total base statistics, the application recommends evolving and shows the percentage improvement.

The recommendation only considers the statistics in the supplied dataset. It does not consider moves, evolution requirements, game version, or personal preference.

## Data

The project uses the `pokemon.csv` dataset supplied with the course assignment.

Direct evolutions are identified by comparing the selected Pokémon's `species_id` with other Pokémon's `evolves_from_species_id`.

Pokémon images are loaded from the PokeAPI sprite repository. If an image is unavailable, the website hides the broken image.

## Technologies

- HTML
- CSS
- JavaScript
- Papa Parse
- GitHub Pages
- PokeAPI sprites

## Run the project locally

1. Download or clone the repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` with Live Server.
4. Use the dropdown to select a Pokémon.

## Limitations

Some Pokémon have multiple possible evolutions or alternate forms. The current version displays the first direct evolution found in the supplied dataset.

The recommendation is based only on base statistics and should not be treated as official Pokémon gameplay advice.
