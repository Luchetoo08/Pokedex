document.addEventListener('DOMContentLoaded', () => {
    const inputSearch = document.getElementById('search');
    const btnSearch = document.getElementById('btn-search');

    btnSearch.addEventListener('click', getPokemon);

    inputSearch.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            getPokemon();
        }
    });
});

function getPokemon() {
    const search = document.getElementById('search');
    const pokemon = search.value.toLowerCase().trim().replace(/\s/g, '');

    if (!pokemon) {
        alert('Por favor ingresa el nombre de un Pokémon');
        return;
    }

    const url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('Pokémon no encontrado');
            return res.json();
        })
        .then(data => {
            // Nombre, tipo y sprite
            let name = data.name;
            let type = "Tipo: " + data.types.map(t => t.type.name).join(', ');
            let sprite = data.sprites.front_default;

            document.getElementById('name').textContent = name;
            document.getElementById('type').textContent = type;
            const img = document.getElementById('sprite');
            img.src = sprite;
            img.alt = "Imagen de " + name;

            // Stats básicas
            const statsMap = {
                hp: 'stat-hp',
                attack: 'stat-attack',
                defense: 'stat-defense',
                'special-attack': 'stat-special-attack',
                'special-defense': 'stat-special-defense',
                speed: 'stat-speed'
            };

            Object.entries(statsMap).forEach(([statName, elementId]) => {
                const statValue = data.stats.find(s => s.stat.name === statName).base_stat;
                const statElement = document.getElementById(elementId);
                statElement.style.width = Math.min(statValue, 100) + '%';
                statElement.textContent = statValue;
            });

            // Stats extras
            const weight = (data.weight / 10).toFixed(1);
            const height = (data.height / 10).toFixed(1);
            const baseExp = data.base_experience;
            const id = data.id;

            document.getElementById('stat-weight').style.width = Math.min(weight * 10, 100) + '%';
            document.getElementById('stat-weight').textContent = weight;

            document.getElementById('stat-height').style.width = Math.min(height * 10, 100) + '%';
            document.getElementById('stat-height').textContent = height;

            document.getElementById('stat-exp').style.width = Math.min(baseExp, 100) + '%';
            document.getElementById('stat-exp').textContent = baseExp;

            document.getElementById('stat-id').style.width = Math.min(id, 100) + '%';
            document.getElementById('stat-id').textContent = id;

            // Mostrar info
            document.getElementById('pokemon-info').classList.add('visible');
        })
        .catch(() => {
            alert('Pokémon no encontrado');

            // Limpiar datos
            ['name', 'type'].forEach(id => document.getElementById(id).textContent = '');
            const img = document.getElementById('sprite');
            img.src = '';
            img.alt = '';

            ['stat-hp', 'stat-attack', 'stat-defense', 'stat-special-attack', 'stat-special-defense', 'stat-speed',
            'stat-weight', 'stat-height', 'stat-exp', 'stat-id'].forEach(id => {
                const el = document.getElementById(id);
                el.style.width = '0%';
                el.textContent = '';
            });

            document.getElementById('pokemon-info').classList.remove('visible');
        });
}
