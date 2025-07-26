document.addEventListener("DOMContentLoaded", () => {
  const dogBar = document.getElementById("dog-bar");
  const dogInfo = document.getElementById("dog-info");
  const filterBtn = document.getElementById("good-dog-filter");

  let allDogs = [];

  // Fetch dogs from the server
  function fetchDogs() {
    fetch("http://localhost:3000/pups")
      .then(res => res.json())
      .then(dogs => {
        allDogs = dogs;
        renderDogBar(dogs);
      });
  }

  // Render dog bar spans
  function renderDogBar(dogs) {
    dogBar.innerHTML = "";
    dogs.forEach(dog => {
      const span = document.createElement("span");
      span.textContent = dog.name;
      span.addEventListener("click", () => showDogInfo(dog));
      dogBar.appendChild(span);
    });
  }

  // Show dog info
  function showDogInfo(dog) {
    dogInfo.innerHTML = `
      <img src="${dog.image}" alt="${dog.name}" />
      <h2>${dog.name}</h2>
      <button id="toggle-btn">${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
    `;

    const toggleBtn = document.getElementById("toggle-btn");
    toggleBtn.addEventListener("click", () => toggleGoodDog(dog));
  }

  // Toggle Good Dog / Bad Dog
  function toggleGoodDog(dog) {
    const newStatus = !dog.isGoodDog;
    fetch(`http://localhost:3000/pups/${dog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isGoodDog: newStatus }),
    })
      .then(res => res.json())
      .then(updatedDog => {
        dog.isGoodDog = updatedDog.isGoodDog;
        showDogInfo(updatedDog);
        if (filterBtn.textContent.includes("ON")) {
          const goodDogs = allDogs.filter(d => d.isGoodDog);
          renderDogBar(goodDogs);
        }
      });
  }

  // Filter functionality
  filterBtn.addEventListener("click", () => {
    const isFilterOn = filterBtn.textContent.includes("ON");
    filterBtn.textContent = `Filter good dogs: ${isFilterOn ? "OFF" : "ON"}`;
    const filteredDogs = isFilterOn ? allDogs : allDogs.filter(dog => dog.isGoodDog);
    renderDogBar(filteredDogs);
  });

  fetchDogs();
});
