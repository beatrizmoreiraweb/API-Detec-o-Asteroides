// 🔑 Chave de API da NASA (necessária para acessar os dados)
const apiKey = "SUA_CHAVE_API";

// 🎯 Seleciona o campo de entrada de data
const dateInput = document.getElementById("datePicker");

// 🗂️ Seleciona o corpo da tabela onde os dados dos asteroides serão inseridos
const tableBody = document.querySelector("#asteroids-table tbody");

// ⚠️ Elemento onde será exibido o alerta de asteroides perigosos
const alerta = document.getElementById("alerta");

// 💬 Modal e seus elementos internos (para mostrar detalhes de um asteroide)
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");

// 📅 Define a data atual no formato YYYY-MM-DD e preenche o input de data com ela
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

// 🌠 Função que busca os asteroides de uma data específica usando a API da NASA
function fetchAsteroids(date) {
    // Monta a URL da requisição com data e chave da API
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;

    // Faz a requisição HTTP
    fetch(url)
        .then(res => res.json()) // Converte a resposta em JSON
        .then(data => {
            // Limpa a tabela e o alerta anterior (caso existam)
            tableBody.innerHTML = "";
            alerta.innerHTML = "";

            // Extrai a lista de asteroides para a data selecionada
            const asteroids = data.near_earth_objects[date];
            let countDangerous = 0; // Contador de asteroides perigosos

            // Para cada asteroide retornado pela API
            asteroids.forEach(asteroid => {
                // Extrai nome, diâmetro médio, velocidade, distância e se é perigoso
                const name = asteroid.name;
                const diameter = ((asteroid.estimated_diameter.meters.estimated_diameter_min + asteroid.estimated_diameter.meters.estimated_diameter_max) / 2).toFixed(1);
                const velocity = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(1);
                const distance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toFixed(0);
                const isDangerous = asteroid.is_potentially_hazardous_asteroid;

                // Cria uma nova linha para a tabela
                const row = document.createElement("tr");

                // Se for perigoso, adiciona classe "danger" e incrementa o contador
                if (isDangerous) {
                    row.classList.add("danger");
                    countDangerous++;
                }

                // Monta o conteúdo da linha com link para ver detalhes
                row.innerHTML = `
                    <td><a href="#" onclick='showDetails(${JSON.stringify(asteroid)})'>${name}</a></td>
                    <td>${diameter}</td>
                    <td>${velocity}</td>
                    <td>${distance}</td>
                    <td>${isDangerous ? "Sim" : "Não"}</td>
                `;

                // Adiciona a linha na tabela
                tableBody.appendChild(row);
            });

            // Se houver asteroides perigosos, exibe um alerta na tela
            if (countDangerous > 0) {
                alerta.innerHTML = `
                    <div class="alert">⚠️ Atenção! ${countDangerous} asteroide(s) potencialmente perigosos hoje.</div>
                `;
            }
        })
        .catch(err => {
            // Se der erro na requisição, mostra mensagem de erro na tabela
            console.error("Erro ao buscar dados:", err);
            tableBody.innerHTML = "<tr><td colspan='5'>Erro ao carregar dados da NASA.</td></tr>";
        });
}

// 🔍 Função que exibe os detalhes do asteroide selecionado no modal
function showDetails(asteroid) {
    // Preenche o título do modal com o nome do asteroide
    modalTitle.textContent = asteroid.name;

    // Extrai magnitude, corpo em órbita e link da NASA
    const magnitude = asteroid.absolute_magnitude_h;
    const orbitingBody = asteroid.close_approach_data[0].orbiting_body;
    const moreInfo = asteroid.nasa_jpl_url;

    // Preenche o conteúdo do modal com essas informações
    modalContent.innerHTML = `
        <p><strong>Magnitude Absoluta:</strong> ${magnitude}</p>
        <p><strong>Corpo em órbita:</strong> ${orbitingBody}</p>
        <p><a href="${moreInfo}" target="_blank">Mais detalhes na NASA ↗</a></p>
    `;

    // Ativa (exibe) o modal na tela
    modal.classList.add("active");
}

// ❌ Função que fecha o modal (remove a classe 'active')
function closeModal() {
    modal.classList.remove("active");
}

// 🗓️ Quando o usuário muda a data, busca os dados dos asteroides para a nova data
dateInput.addEventListener("change", () => {
    fetchAsteroids(dateInput.value);
});

// 🚀 Ao carregar a página, já busca os asteroides do dia atual
fetchAsteroids(today);
