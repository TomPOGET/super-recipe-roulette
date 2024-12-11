var script = document.createElement('script');
script.src = '/js/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

// Variables
let showFilters = false;
const newIngredientInput = document.getElementById('newIngredient');
const tagsContainer = document.getElementById('tagsContainer');
const filterSection = document.getElementById('filterSection');
const selectedRecipeBox = document.getElementById('selectedRecipeBox');
const selectedRecipeName = document.getElementById('selectedRecipeName');
const selectedRecipeLink = document.getElementById('selectedRecipeLink');
const loadingOverlay = document.getElementById('loadingOverlay'); // Overlay element

let prioritizedIngredients = [];
let originalSegments = [
  { color: 'beige', imageSrc: 'img/image1.png' },
  { color: '#ff6347', imageSrc: 'img/image.png' },
  { color: 'beige', imageSrc: 'img/image6.png' },
  { color: '#ff6347', imageSrc: 'img/image.png' },
  { color: 'beige', imageSrc: 'img/image4.png' },
  { color: '#ff6347', imageSrc: 'img/image.png' }
];

let segments = [...originalSegments];
let startAngle = 0;
let arc = Math.PI / (segments.length / 2);
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let isSpinning = false;
let selectedRecipe = null;

// Toggle Filters
function toggleFilters() {
  showFilters = !showFilters;
  filterSection.classList.toggle('active', showFilters);
}

// Add Ingredient
function addIngredient() {
  const newIngredient = newIngredientInput.value.trim();
  if (newIngredient !== '' && !prioritizedIngredients.find(item => item.name.toLowerCase() === newIngredient.toLowerCase())) {
    prioritizedIngredients.push({ name: newIngredient, indispensable: false });
    renderTags();
  }
  newIngredientInput.value = '';
}

// Remove Ingredient
function removeIngredient(index) {
  prioritizedIngredients.splice(index, 1);
  renderTags();
}

// Toggle Indispensable
function toggleIndispensable(index) {
  prioritizedIngredients[index].indispensable = !prioritizedIngredients[index].indispensable;
  renderTags();
}

// Render Tags
function renderTags() {
  tagsContainer.innerHTML = '';
  prioritizedIngredients.forEach((item, index) => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
      <span>${item.name}</span>
      <div class="actions">
        <button onclick="toggleIndispensable(${index})">
          ${item.indispensable ? 'Indispensable' : 'Facultatif'}
        </button>
        <button onclick="removeIngredient(${index})">✖</button>
      </div>
    `;
    tagsContainer.appendChild(tag);
  });
}

// Preload Images and Attach to Segments
function preloadImages() {
  loadingOverlay.style.display = 'block'; // Show loading overlay

  return Promise.all(
    segments.map(segment => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = segment.imageSrc;
        img.onload = () => {
          segment.image = img;
          resolve();
        };
        img.onerror = () => {
          console.error(`Erreur lors du chargement de l'image: ${segment.imageSrc}`);
          segment.image = null; // Pas d'image si échec
          resolve();
        };
      });
    })
  ).finally(() => {
    loadingOverlay.style.display = 'none'; // Hide loading overlay once all images are loaded
  });
}

// Draw Roulette Wheel
function drawRouletteWheel() {
  const canvas = document.getElementById('rouletteCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const outsideRadius = 230;
  const insideRadius = 0;
  const imageRadius = 150;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < segments.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = segments[i].color;

    // Draw segment
    ctx.beginPath();
    ctx.arc(centerX, centerY, outsideRadius, angle, angle + arc, false);
    ctx.arc(centerX, centerY, insideRadius, angle + arc, angle, true);
    ctx.fill();

    // Draw image on the segment
    if (segments[i].image) {
      const img = segments[i].image;
      ctx.save();
      ctx.translate(
        centerX + Math.cos(angle + arc / 2) * imageRadius,
        centerY + Math.sin(angle + arc / 2) * imageRadius
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      ctx.drawImage(img, -30, -30, 60, 60);
      ctx.restore();
    }
  }
}

// Spin the wheel
function spin() {
  if (isSpinning) return;

  // Filter recipes based on ingredients
  const indispensables = prioritizedIngredients.filter(i => i.indispensables).map(i => i.name.charAt(0).toUpperCase() + i.name.slice(1));
  const facultatifs = prioritizedIngredients.filter(i => !i.indispensables).map(i => i.name.charAt(0).toUpperCase() + i.name.slice(1));

	var filteredRecipes;
	$.get('/recipes/search/get-valid-recipes', { indispensables : indispensables, facultatifs : facultatifs }, function(response) {
		filteredRecipes = response.split('$');

		if (filteredRecipes.length === 0) {
			alert('Aucune recette ne correspond aux ingrédients sélectionnés.');
			return;
		}
		else {
			for (let i = 0; i < filteredRecipes.length; i++) {
				filteredRecipes[i] = { name : filteredRecipes[i].split('£')[0], id : filteredRecipes[i].split('£')[1]}
			}
		}

		console.log("Processed");
		console.log(filteredRecipes);

		// Spin settings
		isSpinning = true;
		selectedRecipe = null;
		spinAngleStart = Math.random() * 10 + 10;
		spinTime = 0;
		spinTimeTotal = Math.random() * 6000 + 9000; // Spin for 6-9 seconds
		rotateWheel(filteredRecipes);
	});
}

// Rotate the wheel
function rotateWheel(filteredRecipes) {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel(filteredRecipes);
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  drawRouletteWheel();
  requestAnimationFrame(() => rotateWheel(filteredRecipes));
}

// Stop the wheel
function stopRotateWheel(filteredRecipes) {
  isSpinning = false;

  // Select a random recipe from the filtered recipe list

	console.log(filteredRecipes);

  selectedRecipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];

	console.log(selectedRecipe);

  // Display selected recipe
  selectedRecipeName.textContent = selectedRecipe['name'];
  selectedRecipeLink.href = '/recipes?recipe='+selectedRecipe['id']; // Update with actual link if available
  selectedRecipeBox.style.display = 'block';
}

// Easing function
function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

// Initialize the roulette wheel
document.addEventListener('DOMContentLoaded', () => {
  preloadImages().then(() => {
    drawRouletteWheel();
  });
});