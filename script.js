const apiKey = "COLOQUE_AQUI_CHAVE";
const dateInput = document.getElementById("datePicker");
const tableBody = document.querySelector("#asteroids-table tbody");
const alerta = document.getElementById("alerta");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");

const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

function fetchAsteroids(date) {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        tableBody.innerHTML = "";
        alerta.innerHTML = "";
        const asteroids = data.near_earth_objects[date];
        let countDangerous = 0;

        asteroids.forEach(asteroid => {
        const name = asteroid.name;
        const diameter = ((asteroid.estimated_diameter.meters.estimated_diameter_min + asteroid.estimated_diameter.meters.estimated_diameter_max) / 2).toFixed(1);
        const velocity = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(1);
        const distance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toFixed(0);
        const isDangerous = asteroid.is_potentially_hazardous_asteroid;
        const row = document.createElement("tr");
        if (isDangerous) {
            row.classList.add("danger");
            countDangerous++;
        }

        row.innerHTML = `
            <td><a href="#" onclick='showDetails(${JSON.stringify(asteroid)})'>${name}</a></td>
            <td>${diameter}</td>
            <td>${velocity}</td>
            <td>${distance}</td>
            <td>${isDangerous ? "Sim" : "Não"}</td>
        `;
        tableBody.appendChild(row);
        });

        if (countDangerous > 0) {
        alerta.innerHTML = `
            <div class="alert">⚠️ Atenção! ${countDangerous} asteroide(s) potencialmente perigosos hoje.</div>
        `;
        }
    })
    .catch(err => {
        console.error("Erro ao buscar dados:", err);
        tableBody.innerHTML = "<tr><td colspan='5'>Erro ao carregar dados da NASA.</td></tr>";
    });
}

function showDetails(asteroid) {
    modalTitle.textContent = asteroid.name;
    const magnitude = asteroid.absolute_magnitude_h;
    const orbitingBody = asteroid.close_approach_data[0].orbiting_body;
    const moreInfo = asteroid.nasa_jpl_url;

    modalContent.innerHTML = `
    <p><strong>Magnitude Absoluta:</strong> ${magnitude}</p>
    <p><strong>Corpo em órbita:</strong> ${orbitingBody}</p>
    <p><a href="${moreInfo}" target="_blank">Mais detalhes na NASA ↗</a></p>
    `;
    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
}

dateInput.addEventListener("change", () => {
    fetchAsteroids(dateInput.value);
});


// Carregar dados iniciais
fetchAsteroids(today);