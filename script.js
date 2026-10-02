let pokemonData = [];

Papa.parse("pokemon.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,

  complete: function (results) {
    pokemonData = results.data.map(cleanPokemon);

    console.log("Pokémon data loaded successfully.");
    console.log("Number of rows:", pokemonData.length);
    console.log("First Pokémon:", pokemonData[0]);

    populatePokemonSelect();
  },

  error: function (error) {
    console.error("The CSV could not be loaded:", error);
  }
});

function cleanPokemon(row) {
  return {
    ...row,
    id: Number(row.id),
    species_id: String(row.species_id),
    height: Number(row.height),
    weight: Number(row.weight),
    base_experience: Number(row.base_experience),
    hp: Number(row.hp),
    attack: Number(row.attack),
    defense: Number(row.defense),
    special_attack: Number(row.special_attack),
    special_defense: Number(row.special_defense),
    speed: Number(row.speed)
  };
}

function populatePokemonSelect() {
  const select = document.querySelector("#pokemon-select");

  if (!select) {
    console.error(
      'The dropdown was not found. Add id="pokemon-select" to your select element.'
    );
    return;
  }

  const sortedPokemon = [...pokemonData].sort((a, b) =>
    a.pokemon.localeCompare(b.pokemon)
  );

  sortedPokemon.forEach(pokemon => {
    const option = document.createElement("option");

    option.value = pokemon.id;
    option.textContent = formatName(pokemon.pokemon);

    select.appendChild(option);
  });

  select.addEventListener("change", handlePokemonSelection);
}

function formatName(name) {
  return name
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function handlePokemonSelection(event) {
  const selectedId = Number(event.target.value);

  const selectedPokemon = pokemonData.find(
    pokemon => pokemon.id === selectedId
  );

  const resultSection = document.querySelector("#result");

  if (!selectedPokemon) {
    resultSection.hidden = true;
    return;
  }

  const evolutions = pokemonData.filter(
    candidate =>
      String(candidate.evolves_from_species_id) ===
      String(selectedPokemon.species_id)
  );

  displayResult(selectedPokemon, evolutions);
}

function displayResult(selectedPokemon, evolutions) {
  const resultSection = document.querySelector("#result");

  resultSection.hidden = false;

  if (evolutions.length === 0) {
    resultSection.innerHTML = `
      <h2>Your Pokémon</h2>
      <article class="pokemon-card solo-card" data-type="${getVisualType(selectedPokemon)}">
      <span class="card-stage">Current Pokémon</span>
      <h3>${formatName(selectedPokemon.pokemon)}</h3>
      ${renderTypeBadge(selectedPokemon)}

      <img
  src="${getImageUrl(selectedPokemon)}"
  alt="${formatName(selectedPokemon.pokemon)}"
  class="pokemon-image"
  onerror="this.style.display='none'"
>

      <p><strong>HP:</strong> ${selectedPokemon.hp}</p>
      <p><strong>Attack:</strong> ${selectedPokemon.attack}</p>
      <p><strong>Defense:</strong> ${selectedPokemon.defense}</p>
      <p><strong>Special attack:</strong> ${selectedPokemon.special_attack}</p>
      <p><strong>Special defense:</strong> ${selectedPokemon.special_defense}</p>
      <p><strong>Speed:</strong> ${selectedPokemon.speed}</p>

      </article>
      <section class="recommendation"><h3>No direct evolution was found.</h3></section>
    `;

    return;
  }

  const evolvedPokemon = evolutions[0];

  const currentTotal = calculateTotalStats(selectedPokemon);
const evolvedTotal = calculateTotalStats(evolvedPokemon);

const improvement = evolvedTotal - currentTotal;

const improvementPercentage =
  currentTotal === 0
    ? 0
    : (improvement / currentTotal) * 100;

    resultSection.innerHTML = `
    <h2>Evolution comparison</h2>

    <div class="pokemon-comparison">
      <article class="pokemon-card" data-type="${getVisualType(selectedPokemon)}">
        <span class="card-stage">Current Pokémon</span>
        <h3>${formatName(selectedPokemon.pokemon)}</h3>
        ${renderTypeBadge(selectedPokemon)}

        <img
          src="${getImageUrl(selectedPokemon)}"
          alt="${formatName(selectedPokemon.pokemon)}"
          class="pokemon-image"
          onerror="this.style.display='none'"
        >

        <p><strong>HP:</strong> ${selectedPokemon.hp}</p>
        <p><strong>Attack:</strong> ${selectedPokemon.attack}</p>
        <p><strong>Defense:</strong> ${selectedPokemon.defense}</p>
        <p><strong>Special attack:</strong> ${selectedPokemon.special_attack}</p>
        <p><strong>Special defense:</strong> ${selectedPokemon.special_defense}</p>
        <p><strong>Speed:</strong> ${selectedPokemon.speed}</p>
        <p><strong>Total statistics:</strong> ${currentTotal}</p>
      </article>

      <article class="pokemon-card evolved-card" data-type="${getVisualType(evolvedPokemon)}">
        <span class="card-stage">Next evolution ✦</span>
        <h3>${formatName(evolvedPokemon.pokemon)}</h3>
        ${renderTypeBadge(evolvedPokemon)}

        <img
          src="${getImageUrl(evolvedPokemon)}"
          alt="${formatName(evolvedPokemon.pokemon)}"
          class="pokemon-image"
          onerror="this.style.display='none'"
        >

        <p><strong>HP:</strong> ${evolvedPokemon.hp}</p>
        <p><strong>Attack:</strong> ${evolvedPokemon.attack}</p>
        <p><strong>Defense:</strong> ${evolvedPokemon.defense}</p>
        <p><strong>Special attack:</strong> ${evolvedPokemon.special_attack}</p>
        <p><strong>Special defense:</strong> ${evolvedPokemon.special_defense}</p>
        <p><strong>Speed:</strong> ${evolvedPokemon.speed}</p>
        <p><strong>Total statistics:</strong> ${evolvedTotal}</p>
      </article>
    </div>

    <section class="recommendation">
      <h3>Recommendation</h3>

      <p>
        <strong>Yes, evolve.</strong>
        ${formatName(evolvedPokemon.pokemon)} has
        ${improvementPercentage.toFixed(1)}% higher total base statistics than
        ${formatName(selectedPokemon.pokemon)}.
      </p>

      <p>
        Total statistics increase from ${currentTotal} to ${evolvedTotal}
        (${improvement > 0 ? "+" : ""}${improvement} points).
      </p>
    </section>
  `;

}
function calculateTotalStats(pokemon) {
  return (
    Number(pokemon.hp) +
    Number(pokemon.attack) +
    Number(pokemon.defense) +
    Number(pokemon.special_attack) +
    Number(pokemon.special_defense) +
    Number(pokemon.speed)
  );
}

function getImageUrl(pokemon) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
}
// Presentation only: type themes do not affect matching or recommendations.
function getVisualType(pokemon) {
  const types = ["normal", "fire", "water", "electric", "grass", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug", "rock",
    "ghost", "dragon", "dark", "steel", "fairy"];
  return types.includes(pokemon.type_1) ? pokemon.type_1 : "normal";
}

function renderTypeBadge(pokemon) {
  return `<span class="type-badge">${formatName(getVisualType(pokemon))}</span>`;
}
