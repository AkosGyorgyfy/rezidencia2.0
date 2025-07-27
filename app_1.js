// Household Manager Application
class HouseholdManager {
    constructor() {
        this.data = {
            shopping: [],
            recipes: [],
            todos: []
        };
        
        this.currentEditId = null;
        this.currentEditType = null;
        this.currentRecipe = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.loadSampleData();
        this.updateDashboardStats();
        this.renderShopping();
        this.renderRecipes();
        this.renderTodos();
    }

    loadSampleData() {
        // Load sample data if no data exists
        if (this.data.shopping.length === 0 && this.data.recipes.length === 0 && this.data.todos.length === 0) {
            const sampleData = {
                "shopping_items": [
                    {"id": 1, "name": "Tej", "quantity": "1 liter", "category": "Élelmiszer", "completed": false},
                    {"id": 2, "name": "Kenyér", "quantity": "1 db", "category": "Élelmiszer", "completed": true}
                ],
                "recipes": [
                    {
                        "id": 1,
                        "name": "Bolognai spagetti",
                        "category": "Főétel",
                        "ingredients": ["500g spagetti", "300g darált hús", "1 db hagyma", "2 db paradicsom", "só, bors"],
                        "instructions": "1. Főzd meg a tésztát\n2. Pirítsd meg a hagymát\n3. Add hozzá a húst\n4. Tedd bele a paradicsomot",
                        "favorite": true
                    }
                ],
                "todos": [
                    {"id": 1, "name": "Porszívózás", "category": "Házimunka", "priority": "Közepes", "deadline": "2025-07-30", "completed": false},
                    {"id": 2, "name": "Gyógyszertár", "category": "Bevásárlás", "priority": "Magas", "deadline": "2025-07-28", "completed": true}
                ]
            };

            this.data.shopping = sampleData.shopping_items;
            this.data.recipes = sampleData.recipes;
            this.data.todos = sampleData.todos;
            
            this.saveData();
            this.renderShopping();
            this.renderRecipes();
            this.renderTodos();
            this.updateDashboardStats();
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.navigateTo(item.dataset.section);
            });
        });

        document.querySelectorAll('.dashboard-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.navigateTo(card.dataset.nav);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }

        // Shopping list
        const addShoppingBtn = document.getElementById('addShoppingItem');
        if (addShoppingBtn) {
            addShoppingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openShoppingModal();
            });
        }

        const shoppingForm = document.getElementById('shoppingForm');
        if (shoppingForm) {
            shoppingForm.addEventListener('submit', (e) => this.saveShoppingItem(e));
        }

        // Modal close buttons
        document.getElementById('closeShoppingModal')?.addEventListener('click', () => this.closeModal('shoppingModal'));
        document.getElementById('cancelShopping')?.addEventListener('click', () => this.closeModal('shoppingModal'));
        
        // Filters
        document.getElementById('shoppingCategoryFilter')?.addEventListener('change', () => this.renderShopping());
        document.getElementById('exportShopping')?.addEventListener('click', () => this.exportShoppingList());
        document.getElementById('clearShopping')?.addEventListener('click', () => this.clearShoppingList());

        // Recipes
        document.getElementById('addRecipe')?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openRecipeModal();
        });
        document.getElementById('recipeForm')?.addEventListener('submit', (e) => this.saveRecipe(e));
        document.getElementById('closeRecipeModal')?.addEventListener('click', () => this.closeModal('recipeModal'));
        document.getElementById('cancelRecipe')?.addEventListener('click', () => this.closeModal('recipeModal'));
        document.getElementById('recipeSearch')?.addEventListener('input', () => this.renderRecipes());
        document.getElementById('closeRecipeDetail')?.addEventListener('click', () => this.closeModal('recipeDetailModal'));
        document.getElementById('editRecipeDetail')?.addEventListener('click', () => this.editCurrentRecipe());
        document.getElementById('addIngredientsToShopping')?.addEventListener('click', () => this.addIngredientsToShopping());
        document.getElementById('toggleFavorite')?.addEventListener('click', () => this.toggleRecipeFavorite());

        // Todos
        document.getElementById('addTodo')?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openTodoModal();
        });
        document.getElementById('todoForm')?.addEventListener('submit', (e) => this.saveTodo(e));
        document.getElementById('closeTodoModal')?.addEventListener('click', () => this.closeModal('todoModal'));
        document.getElementById('cancelTodo')?.addEventListener('click', () => this.closeModal('todoModal'));
        document.getElementById('todoPriorityFilter')?.addEventListener('change', () => this.renderTodos());

        // Toast
        document.getElementById('closeToast')?.addEventListener('click', () => this.closeToast());

        // Modal backdrop clicks
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.closeModal(backdrop.parentElement.id);
                }
            });
        });
    }

    navigateTo(section) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNavItem = document.querySelector(`[data-section="${section}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Show/hide content sections
        document.querySelectorAll('.content-section').forEach(contentSection => {
            contentSection.classList.remove('active');
        });
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
        
        localStorage.setItem('theme', newTheme);
    }

    loadData() {
        const saved = localStorage.getItem('householdData');
        if (saved) {
            try {
                this.data = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading data:', e);
                this.data = { shopping: [], recipes: [], todos: [] };
            }
        }

        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-color-scheme', savedTheme);
            const themeIcon = document.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
            }
        }
    }

    saveData() {
        try {
            localStorage.setItem('householdData', JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toast.className = `toast ${type}`;
            toastMessage.textContent = message;
            toast.classList.remove('hidden');

            setTimeout(() => {
                this.closeToast();
            }, 3000);
        }
    }

    closeToast() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.add('hidden');
        }
    }

    updateDashboardStats() {
        const shoppingActive = this.data.shopping.filter(item => !item.completed).length;
        const shoppingTotal = this.data.shopping.length;
        const shoppingStats = document.getElementById('shoppingStats');
        if (shoppingStats) {
            shoppingStats.textContent = `${shoppingActive}/${shoppingTotal} termék`;
        }

        const recipeStats = document.getElementById('recipeStats');
        if (recipeStats) {
            recipeStats.textContent = `${this.data.recipes.length} recept`;
        }

        const todosActive = this.data.todos.filter(todo => !todo.completed).length;
        const todosTotal = this.data.todos.length;
        const todoStats = document.getElementById('todoStats');
        if (todoStats) {
            todoStats.textContent = `${todosActive}/${todosTotal} feladat`;
        }
    }

    // Shopping List Methods
    openShoppingModal(item = null) {
        this.currentEditId = item ? item.id : null;
        this.currentEditType = 'shopping';

        const modal = document.getElementById('shoppingModal');
        const title = document.getElementById('shoppingModalTitle');
        const form = document.getElementById('shoppingForm');

        if (title) {
            title.textContent = item ? 'Termék szerkesztése' : 'Termék hozzáadása';
        }
        
        if (item) {
            const nameField = document.getElementById('shoppingName');
            const quantityField = document.getElementById('shoppingQuantity');
            const categoryField = document.getElementById('shoppingCategory');
            
            if (nameField) nameField.value = item.name;
            if (quantityField) quantityField.value = item.quantity;
            if (categoryField) categoryField.value = item.category;
        } else if (form) {
            form.reset();
        }

        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    saveShoppingItem(e) {
        e.preventDefault();
        
        const name = document.getElementById('shoppingName')?.value.trim();
        const quantity = document.getElementById('shoppingQuantity')?.value.trim();
        const category = document.getElementById('shoppingCategory')?.value;

        if (!name || !quantity) return;

        const item = {
            id: this.currentEditId || Date.now(),
            name,
            quantity,
            category,
            completed: false
        };

        if (this.currentEditId) {
            const index = this.data.shopping.findIndex(i => i.id === this.currentEditId);
            if (index !== -1) {
                item.completed = this.data.shopping[index].completed;
                this.data.shopping[index] = item;
            }
            this.showToast('Termék sikeresen frissítve!');
        } else {
            this.data.shopping.push(item);
            this.showToast('Termék sikeresen hozzáadva!');
        }

        this.saveData();
        this.renderShopping();
        this.updateDashboardStats();
        this.closeModal('shoppingModal');
    }

    toggleShoppingItem(id) {
        const item = this.data.shopping.find(i => i.id === id);
        if (item) {
            item.completed = !item.completed;
            this.saveData();
            this.renderShopping();
            this.updateDashboardStats();
        }
    }

    deleteShoppingItem(id) {
        if (confirm('Biztosan törölni szeretnéd ezt a terméket?')) {
            this.data.shopping = this.data.shopping.filter(i => i.id !== id);
            this.saveData();
            this.renderShopping();
            this.updateDashboardStats();
            this.showToast('Termék törölve!');
        }
    }

    exportShoppingList() {
        const filter = document.getElementById('shoppingCategoryFilter')?.value;
        let items = this.data.shopping;
        
        if (filter) {
            items = items.filter(item => item.category === filter);
        }

        const exportText = items.map(item => 
            `${item.completed ? '✓' : '○'} ${item.name} - ${item.quantity} (${item.category})`
        ).join('\n');

        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bevasarlolista.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Bevásárlólista exportálva!');
    }

    clearShoppingList() {
        if (confirm('Biztosan törölni szeretnéd az összes terméket?')) {
            this.data.shopping = [];
            this.saveData();
            this.renderShopping();
            this.updateDashboardStats();
            this.showToast('Bevásárlólista törölve!');
        }
    }

    renderShopping() {
        const container = document.getElementById('shoppingList');
        if (!container) return;

        const filter = document.getElementById('shoppingCategoryFilter')?.value || '';
        
        let items = this.data.shopping;
        if (filter) {
            items = items.filter(item => item.category === filter);
        }

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🛒</div>
                    <h3>Üres a bevásárlólista</h3>
                    <p>Kezdj el hozzáadni termékeket!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="shopping-item ${item.completed ? 'completed' : ''}">
                <input type="checkbox" class="shopping-checkbox" 
                       ${item.completed ? 'checked' : ''} 
                       onclick="event.stopPropagation(); app.toggleShoppingItem(${item.id})">
                <div class="shopping-details">
                    <div class="shopping-name">${this.escapeHtml(item.name)}</div>
                    <div class="shopping-meta">
                        <span class="shopping-quantity">${this.escapeHtml(item.quantity)}</span>
                        <span class="shopping-category">${this.escapeHtml(item.category)}</span>
                    </div>
                </div>
                <div class="shopping-actions">
                    <button class="action-btn edit" onclick="event.stopPropagation(); app.editShoppingItem(${item.id})" title="Szerkesztés">
                        ✏️
                    </button>
                    <button class="action-btn delete" onclick="event.stopPropagation(); app.deleteShoppingItem(${item.id})" title="Törlés">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    editShoppingItem(id) {
        const item = this.data.shopping.find(i => i.id === id);
        if (item) {
            this.openShoppingModal(item);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Recipe Methods
    openRecipeModal(recipe = null) {
        this.currentEditId = recipe ? recipe.id : null;
        this.currentEditType = 'recipe';

        const modal = document.getElementById('recipeModal');
        const title = document.getElementById('recipeModalTitle');
        const form = document.getElementById('recipeForm');

        if (title) {
            title.textContent = recipe ? 'Recept szerkesztése' : 'Recept hozzáadása';
        }
        
        if (recipe) {
            const nameField = document.getElementById('recipeName');
            const categoryField = document.getElementById('recipeCategory');
            const ingredientsField = document.getElementById('recipeIngredients');
            const instructionsField = document.getElementById('recipeInstructions');
            
            if (nameField) nameField.value = recipe.name;
            if (categoryField) categoryField.value = recipe.category;
            if (ingredientsField) ingredientsField.value = recipe.ingredients.join('\n');
            if (instructionsField) instructionsField.value = recipe.instructions;
        } else if (form) {
            form.reset();
        }

        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    saveRecipe(e) {
        e.preventDefault();
        
        const name = document.getElementById('recipeName')?.value.trim();
        const category = document.getElementById('recipeCategory')?.value;
        const ingredientsText = document.getElementById('recipeIngredients')?.value.trim();
        const instructions = document.getElementById('recipeInstructions')?.value.trim();

        if (!name || !ingredientsText || !instructions) return;

        const ingredients = ingredientsText.split('\n').filter(i => i.trim());

        const recipe = {
            id: this.currentEditId || Date.now(),
            name,
            category,
            ingredients,
            instructions,
            favorite: false
        };

        if (this.currentEditId) {
            const index = this.data.recipes.findIndex(r => r.id === this.currentEditId);
            if (index !== -1) {
                recipe.favorite = this.data.recipes[index].favorite;
                this.data.recipes[index] = recipe;
            }
            this.showToast('Recept sikeresen frissítve!');
        } else {
            this.data.recipes.push(recipe);
            this.showToast('Recept sikeresen hozzáadva!');
        }

        this.saveData();
        this.renderRecipes();
        this.updateDashboardStats();
        this.closeModal('recipeModal');
    }

    deleteRecipe(id) {
        if (confirm('Biztosan törölni szeretnéd ezt a receptet?')) {
            this.data.recipes = this.data.recipes.filter(r => r.id !== id);
            this.saveData();
            this.renderRecipes();
            this.updateDashboardStats();
            this.showToast('Recept törölve!');
        }
    }

    viewRecipe(id) {
        const recipe = this.data.recipes.find(r => r.id === id);
        if (!recipe) return;

        this.currentRecipe = recipe;
        
        const titleEl = document.getElementById('recipeDetailTitle');
        const categoryEl = document.getElementById('recipeDetailCategory');
        
        if (titleEl) titleEl.textContent = recipe.name;
        if (categoryEl) {
            categoryEl.textContent = recipe.category;
            categoryEl.className = 'status status--info';
        }
        
        const favoriteBtn = document.getElementById('toggleFavorite');
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('active', recipe.favorite);
        }
        
        const ingredientsList = document.getElementById('recipeDetailIngredients');
        if (ingredientsList) {
            ingredientsList.innerHTML = recipe.ingredients.map(ingredient => 
                `<li>${this.escapeHtml(ingredient)}</li>`
            ).join('');
        }
        
        const instructionsEl = document.getElementById('recipeDetailInstructions');
        if (instructionsEl) {
            instructionsEl.textContent = recipe.instructions;
        }
        
        const modal = document.getElementById('recipeDetailModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    editCurrentRecipe() {
        if (this.currentRecipe) {
            this.closeModal('recipeDetailModal');
            this.openRecipeModal(this.currentRecipe);
        }
    }

    toggleRecipeFavorite() {
        if (this.currentRecipe) {
            const recipe = this.data.recipes.find(r => r.id === this.currentRecipe.id);
            if (recipe) {
                recipe.favorite = !recipe.favorite;
                this.currentRecipe.favorite = recipe.favorite;
                
                const favoriteBtn = document.getElementById('toggleFavorite');
                if (favoriteBtn) {
                    favoriteBtn.classList.toggle('active', recipe.favorite);
                }
                
                this.saveData();
                this.renderRecipes();
                this.showToast(recipe.favorite ? 'Hozzáadva a kedvencekhez!' : 'Eltávolítva a kedvencekből!');
            }
        }
    }

    addIngredientsToShopping() {
        if (this.currentRecipe) {
            let addedCount = 0;
            this.currentRecipe.ingredients.forEach(ingredient => {
                const exists = this.data.shopping.some(item => 
                    item.name.toLowerCase() === ingredient.toLowerCase()
                );
                
                if (!exists) {
                    this.data.shopping.push({
                        id: Date.now() + Math.random(),
                        name: ingredient,
                        quantity: '1 db',
                        category: 'Élelmiszer',
                        completed: false
                    });
                    addedCount++;
                }
            });
            
            if (addedCount > 0) {
                this.saveData();
                this.renderShopping();
                this.updateDashboardStats();
                this.showToast(`${addedCount} hozzávaló hozzáadva a bevásárlólistához!`);
            } else {
                this.showToast('A hozzávalók már mind rajta vannak a listán!', 'info');
            }
        }
    }

    renderRecipes() {
        const container = document.getElementById('recipesList');
        if (!container) return;

        const searchTerm = document.getElementById('recipeSearch')?.value.toLowerCase() || '';
        
        let recipes = this.data.recipes;
        if (searchTerm) {
            recipes = recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(searchTerm) ||
                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
            );
        }

        if (recipes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📖</div>
                    <h3>Nincsenek receptek</h3>
                    <p>Kezdj el hozzáadni recepteket!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" onclick="app.viewRecipe(${recipe.id})">
                <div class="recipe-header">
                    <h3 class="recipe-title">${this.escapeHtml(recipe.name)}</h3>
                    <button class="favorite-btn ${recipe.favorite ? 'active' : ''}" 
                            onclick="event.stopPropagation(); app.toggleRecipeFavoriteFromCard(${recipe.id})">
                        <span class="favorite-icon">⭐</span>
                    </button>
                </div>
                <div class="recipe-category">${this.escapeHtml(recipe.category)}</div>
                <div class="recipe-preview">
                    ${recipe.ingredients.slice(0, 3).map(ing => this.escapeHtml(ing)).join(', ')}${recipe.ingredients.length > 3 ? '...' : ''}
                </div>
                <div class="recipe-actions">
                    <button class="btn btn--outline btn--sm" onclick="event.stopPropagation(); app.editRecipeFromCard(${recipe.id})">
                        Szerkesztés
                    </button>
                    <button class="btn btn--secondary btn--sm" onclick="event.stopPropagation(); app.deleteRecipe(${recipe.id})">
                        Törlés
                    </button>
                </div>
            </div>
        `).join('');
    }

    editRecipeFromCard(id) {
        const recipe = this.data.recipes.find(r => r.id === id);
        if (recipe) {
            this.openRecipeModal(recipe);
        }
    }

    toggleRecipeFavoriteFromCard(id) {
        const recipe = this.data.recipes.find(r => r.id === id);
        if (recipe) {
            recipe.favorite = !recipe.favorite;
            this.saveData();
            this.renderRecipes();
            this.showToast(recipe.favorite ? 'Hozzáadva a kedvencekhez!' : 'Eltávolítva a kedvencekből!');
        }
    }

    // Todo Methods
    openTodoModal(todo = null) {
        this.currentEditId = todo ? todo.id : null;
        this.currentEditType = 'todo';

        const modal = document.getElementById('todoModal');
        const title = document.getElementById('todoModalTitle');
        const form = document.getElementById('todoForm');

        if (title) {
            title.textContent = todo ? 'Feladat szerkesztése' : 'Feladat hozzáadása';
        }
        
        if (todo) {
            const nameField = document.getElementById('todoName');
            const categoryField = document.getElementById('todoCategory');
            const priorityField = document.getElementById('todoPriority');
            const deadlineField = document.getElementById('todoDeadline');
            
            if (nameField) nameField.value = todo.name;
            if (categoryField) categoryField.value = todo.category;
            if (priorityField) priorityField.value = todo.priority;
            if (deadlineField) deadlineField.value = todo.deadline;
        } else {
            if (form) form.reset();
            // Set default deadline to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const deadlineField = document.getElementById('todoDeadline');
            if (deadlineField) {
                deadlineField.value = tomorrow.toISOString().split('T')[0];
            }
        }

        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    saveTodo(e) {
        e.preventDefault();
        
        const name = document.getElementById('todoName')?.value.trim();
        const category = document.getElementById('todoCategory')?.value;
        const priority = document.getElementById('todoPriority')?.value;
        const deadline = document.getElementById('todoDeadline')?.value;

        if (!name || !deadline) return;

        const todo = {
            id: this.currentEditId || Date.now(),
            name,
            category,
            priority,
            deadline,
            completed: false
        };

        if (this.currentEditId) {
            const index = this.data.todos.findIndex(t => t.id === this.currentEditId);
            if (index !== -1) {
                todo.completed = this.data.todos[index].completed;
                this.data.todos[index] = todo;
            }
            this.showToast('Feladat sikeresen frissítve!');
        } else {
            this.data.todos.push(todo);
            this.showToast('Feladat sikeresen hozzáadva!');
        }

        this.saveData();
        this.renderTodos();
        this.updateDashboardStats();
        this.closeModal('todoModal');
    }

    toggleTodo(id) {
        const todo = this.data.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveData();
            this.renderTodos();
            this.updateDashboardStats();
        }
    }

    deleteTodo(id) {
        if (confirm('Biztosan törölni szeretnéd ezt a feladatot?')) {
            this.data.todos = this.data.todos.filter(t => t.id !== id);
            this.saveData();
            this.renderTodos();
            this.updateDashboardStats();
            this.showToast('Feladat törölve!');
        }
    }

    editTodo(id) {
        const todo = this.data.todos.find(t => t.id === id);
        if (todo) {
            this.openTodoModal(todo);
        }
    }

    isOverdue(deadline) {
        const today = new Date().toISOString().split('T')[0];
        return deadline < today;
    }

    renderTodos() {
        const container = document.getElementById('todosList');
        if (!container) return;

        const priorityFilter = document.getElementById('todoPriorityFilter')?.value || '';
        
        let todos = this.data.todos;
        if (priorityFilter) {
            todos = todos.filter(todo => todo.priority === priorityFilter);
        }

        if (todos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✅</div>
                    <h3>Nincsenek feladatok</h3>
                    <p>Kezdj el hozzáadni teendőket!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = todos.map(todo => {
            const overdue = !todo.completed && this.isOverdue(todo.deadline);
            const priorityClass = todo.priority === 'Magas' ? 'high' : 
                                 todo.priority === 'Közepes' ? 'medium' : 'low';
            
            return `
                <div class="todo-item ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}">
                    <input type="checkbox" class="todo-checkbox" 
                           ${todo.completed ? 'checked' : ''} 
                           onclick="event.stopPropagation(); app.toggleTodo(${todo.id})">
                    <div class="todo-details">
                        <div class="todo-name">${this.escapeHtml(todo.name)}</div>
                        <div class="todo-meta">
                            <span class="todo-deadline ${overdue ? 'overdue' : ''}">${todo.deadline}</span>
                            <span class="priority-badge ${priorityClass}">${this.escapeHtml(todo.priority)}</span>
                            <span class="todo-category">${this.escapeHtml(todo.category)}</span>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="action-btn edit" onclick="event.stopPropagation(); app.editTodo(${todo.id})" title="Szerkesztés">
                            ✏️
                        </button>
                        <button class="action-btn delete" onclick="event.stopPropagation(); app.deleteTodo(${todo.id})" title="Törlés">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Modal Methods
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentEditId = null;
        this.currentEditType = null;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new HouseholdManager();
});