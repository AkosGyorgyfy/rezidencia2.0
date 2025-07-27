
import streamlit as st
import pandas as pd
import json
from datetime import datetime, date
import os

# Page config
st.set_page_config(
    page_title="Háztartási Menedzser",
    page_icon="🏠",
    layout="wide"
)

# CSS stílus
st.markdown("""
<style>
    .main-header {
        color: #2E5D8E;
        text-align: center;
        padding: 1rem 0;
        border-bottom: 2px solid #E1E5E9;
        margin-bottom: 2rem;
    }
    .section-header {
        color: #2E5D8E;
        border-left: 4px solid #4A90E2;
        padding-left: 1rem;
        margin: 1.5rem 0;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    .completed-item {
        text-decoration: line-through;
        opacity: 0.6;
    }
    .priority-high {
        border-left: 4px solid #FF4444;
    }
    .priority-medium {
        border-left: 4px solid #FFA500;
    }
    .priority-low {
        border-left: 4px solid #4CAF50;
    }
</style>
""", unsafe_allow_html=True)

# Adatok inicializálása
def init_data():
    """Alapértelmezett adatok inicializálása"""
    if 'shopping_list' not in st.session_state:
        st.session_state.shopping_list = []
    if 'recipes' not in st.session_state:
        st.session_state.recipes = []
    if 'todos' not in st.session_state:
        st.session_state.todos = []

# Bevásárlólista funkciók
def add_shopping_item():
    """Termék hozzáadása a bevásárlólistához"""
    if st.session_state.shopping_name and st.session_state.shopping_quantity:
        new_item = {
            'id': len(st.session_state.shopping_list) + 1,
            'name': st.session_state.shopping_name,
            'quantity': st.session_state.shopping_quantity,
            'category': st.session_state.shopping_category,
            'completed': False,
            'date_added': datetime.now().strftime('%Y-%m-%d')
        }
        st.session_state.shopping_list.append(new_item)
        st.session_state.shopping_name = ""
        st.session_state.shopping_quantity = ""
        st.success("Termék hozzáadva!")

def toggle_shopping_item(item_id):
    """Termék állapotának váltása"""
    for item in st.session_state.shopping_list:
        if item['id'] == item_id:
            item['completed'] = not item['completed']
            break

def remove_shopping_item(item_id):
    """Termék eltávolítása"""
    st.session_state.shopping_list = [item for item in st.session_state.shopping_list if item['id'] != item_id]

# Recept funkciók
def add_recipe():
    """Recept hozzáadása"""
    if st.session_state.recipe_name and st.session_state.recipe_ingredients:
        ingredients_list = [ing.strip() for ing in st.session_state.recipe_ingredients.split('\n') if ing.strip()]
        new_recipe = {
            'id': len(st.session_state.recipes) + 1,
            'name': st.session_state.recipe_name,
            'category': st.session_state.recipe_category,
            'ingredients': ingredients_list,
            'instructions': st.session_state.recipe_instructions,
            'favorite': False,
            'date_added': datetime.now().strftime('%Y-%m-%d')
        }
        st.session_state.recipes.append(new_recipe)
        st.session_state.recipe_name = ""
        st.session_state.recipe_ingredients = ""
        st.session_state.recipe_instructions = ""
        st.success("Recept hozzáadva!")

def add_ingredients_to_shopping(recipe_id):
    """Recept hozzávalóinak hozzáadása a bevásárlólistához"""
    recipe = next((r for r in st.session_state.recipes if r['id'] == recipe_id), None)
    if recipe:
        for ingredient in recipe['ingredients']:
            new_item = {
                'id': len(st.session_state.shopping_list) + 1,
                'name': ingredient,
                'quantity': '1 db',
                'category': 'Élelmiszer',
                'completed': False,
                'date_added': datetime.now().strftime('%Y-%m-%d')
            }
            st.session_state.shopping_list.append(new_item)
        st.success(f"{recipe['name']} hozzávalói hozzáadva a bevásárlólistához!")

# Teendő funkciók
def add_todo():
    """Teendő hozzáadása"""
    if st.session_state.todo_name:
        new_todo = {
            'id': len(st.session_state.todos) + 1,
            'name': st.session_state.todo_name,
            'category': st.session_state.todo_category,
            'priority': st.session_state.todo_priority,
            'deadline': st.session_state.todo_deadline.strftime('%Y-%m-%d') if st.session_state.todo_deadline else None,
            'completed': False,
            'date_added': datetime.now().strftime('%Y-%m-%d')
        }
        st.session_state.todos.append(new_todo)
        st.session_state.todo_name = ""
        st.success("Teendő hozzáadva!")

def toggle_todo(todo_id):
    """Teendő állapotának váltása"""
    for todo in st.session_state.todos:
        if todo['id'] == todo_id:
            todo['completed'] = not todo['completed']
            break

def remove_todo(todo_id):
    """Teendő eltávolítása"""
    st.session_state.todos = [todo for todo in st.session_state.todos if todo['id'] != todo_id]

# Főalkalmazás
def main():
    init_data()

    st.markdown('<h1 class="main-header">🏠 Háztartási Menedzser</h1>', unsafe_allow_html=True)

    # Sidebar navigáció
    with st.sidebar:
        st.title("Navigáció")
        page = st.selectbox("Válassz egy oldalt:", [
            "🏠 Dashboard", 
            "🛒 Bevásárlólista", 
            "📖 Receptek", 
            "✅ Teendők"
        ])

        st.markdown("---")
        st.markdown("### Gyors műveletek")

        if st.button("🗑️ Összes adat törlése"):
            st.session_state.shopping_list = []
            st.session_state.recipes = []
            st.session_state.todos = []
            st.success("Minden adat törölve!")

    # Dashboard
    if page == "🏠 Dashboard":
        st.markdown('<h2 class="section-header">Dashboard</h2>', unsafe_allow_html=True)

        col1, col2, col3, col4 = st.columns(4)

        with col1:
            total_shopping = len(st.session_state.shopping_list)
            completed_shopping = len([item for item in st.session_state.shopping_list if item['completed']])
            st.markdown(f"""
            <div class="metric-card">
                <h3>🛒 Bevásárlólista</h3>
                <p>{completed_shopping}/{total_shopping} megvéve</p>
            </div>
            """, unsafe_allow_html=True)

        with col2:
            total_recipes = len(st.session_state.recipes)
            favorite_recipes = len([recipe for recipe in st.session_state.recipes if recipe.get('favorite', False)])
            st.markdown(f"""
            <div class="metric-card">
                <h3>📖 Receptek</h3>
                <p>{total_recipes} recept ({favorite_recipes} kedvenc)</p>
            </div>
            """, unsafe_allow_html=True)

        with col3:
            total_todos = len(st.session_state.todos)
            completed_todos = len([todo for todo in st.session_state.todos if todo['completed']])
            st.markdown(f"""
            <div class="metric-card">
                <h3>✅ Teendők</h3>
                <p>{completed_todos}/{total_todos} elvégezve</p>
            </div>
            """, unsafe_allow_html=True)

        with col4:
            overdue_todos = 0
            today = date.today()
            for todo in st.session_state.todos:
                if not todo['completed'] and todo['deadline']:
                    deadline = datetime.strptime(todo['deadline'], '%Y-%m-%d').date()
                    if deadline < today:
                        overdue_todos += 1

            st.markdown(f"""
            <div class="metric-card">
                <h3>⚠️ Lejárt</h3>
                <p>{overdue_todos} lejárt teendő</p>
            </div>
            """, unsafe_allow_html=True)

    # Bevásárlólista oldal
    elif page == "🛒 Bevásárlólista":
        st.markdown('<h2 class="section-header">Bevásárlólista</h2>', unsafe_allow_html=True)

        # Új termék hozzáadása
        with st.expander("➕ Új termék hozzáadása", expanded=True):
            col1, col2, col3 = st.columns(3)
            with col1:
                st.text_input("Termék neve:", key="shopping_name")
            with col2:
                st.text_input("Mennyiség:", key="shopping_quantity")
            with col3:
                st.selectbox("Kategória:", ["Élelmiszer", "Háztartás", "Egyéb"], key="shopping_category")

            if st.button("Hozzáadás", on_click=add_shopping_item):
                pass

        # Bevásárlólista megjelenítése
        if st.session_state.shopping_list:
            st.markdown("### 📋 Jelenlegi lista")

            for item in st.session_state.shopping_list:
                col1, col2, col3, col4, col5 = st.columns([3, 2, 2, 1, 1])

                with col1:
                    item_class = "completed-item" if item['completed'] else ""
                    st.markdown(f'<p class="{item_class}">{item["name"]}</p>', unsafe_allow_html=True)

                with col2:
                    st.text(item['quantity'])

                with col3:
                    st.text(item['category'])

                with col4:
                    if st.button("✓" if not item['completed'] else "↺", key=f"toggle_{item['id']}"):
                        toggle_shopping_item(item['id'])
                        st.rerun()

                with col5:
                    if st.button("🗑️", key=f"remove_{item['id']}"):
                        remove_shopping_item(item['id'])
                        st.rerun()
        else:
            st.info("A bevásárlólista üres. Adj hozzá termékeket!")

    # Receptek oldal
    elif page == "📖 Receptek":
        st.markdown('<h2 class="section-header">Receptek</h2>', unsafe_allow_html=True)

        # Új recept hozzáadása
        with st.expander("➕ Új recept hozzáadása"):
            st.text_input("Recept neve:", key="recipe_name")
            st.selectbox("Kategória:", ["Előétel", "Főétel", "Desszert", "Ital"], key="recipe_category")
            st.text_area("Hozzávalók (soronként egy):", key="recipe_ingredients", height=100)
            st.text_area("Elkészítés:", key="recipe_instructions", height=150)

            if st.button("Recept hozzáadása", on_click=add_recipe):
                pass

        # Receptek megjelenítése
        if st.session_state.recipes:
            st.markdown("### 🍳 Receptjeim")

            for recipe in st.session_state.recipes:
                with st.expander(f"📖 {recipe['name']} ({recipe['category']})"):
                    col1, col2 = st.columns([3, 1])

                    with col1:
                        st.markdown("**Hozzávalók:**")
                        for ingredient in recipe['ingredients']:
                            st.markdown(f"• {ingredient}")

                        if recipe['instructions']:
                            st.markdown("**Elkészítés:**")
                            st.markdown(recipe['instructions'])

                    with col2:
                        if st.button("🛒 Hozzávalók a listához", key=f"add_ingredients_{recipe['id']}"):
                            add_ingredients_to_shopping(recipe['id'])
                            st.rerun()
        else:
            st.info("Még nincsenek receptjeid. Adj hozzá egyet!")

    # Teendők oldal
    elif page == "✅ Teendők":
        st.markdown('<h2 class="section-header">Teendők</h2>', unsafe_allow_html=True)

        # Új teendő hozzáadása
        with st.expander("➕ Új teendő hozzáadása"):
            col1, col2 = st.columns(2)
            with col1:
                st.text_input("Teendő neve:", key="todo_name")
                st.selectbox("Kategória:", ["Házimunka", "Bevásárlás", "Egyéb"], key="todo_category")
            with col2:
                st.selectbox("Prioritás:", ["Alacsony", "Közepes", "Magas"], key="todo_priority")
                st.date_input("Határidő:", key="todo_deadline")

            if st.button("Teendő hozzáadása", on_click=add_todo):
                pass

        # Teendők megjelenítése
        if st.session_state.todos:
            st.markdown("### 📋 Teendőim")

            # Aktív teendők
            active_todos = [todo for todo in st.session_state.todos if not todo['completed']]
            completed_todos = [todo for todo in st.session_state.todos if todo['completed']]

            if active_todos:
                st.markdown("#### Aktív teendők")
                for todo in active_todos:
                    priority_class = f"priority-{todo['priority'].lower()}"

                    col1, col2, col3, col4, col5 = st.columns([3, 2, 2, 1, 1])

                    with col1:
                        st.markdown(f'<div class="{priority_class}" style="padding: 0.5rem;">{todo["name"]}</div>', 
                                  unsafe_allow_html=True)

                    with col2:
                        st.text(todo['category'])

                    with col3:
                        if todo['deadline']:
                            deadline = datetime.strptime(todo['deadline'], '%Y-%m-%d').date()
                            today = date.today()
                            if deadline < today:
                                st.markdown("🔴 Lejárt")
                            elif deadline == today:
                                st.markdown("🟡 Ma")
                            else:
                                st.text(todo['deadline'])
                        else:
                            st.text("Nincs határidő")

                    with col4:
                        if st.button("✓", key=f"complete_{todo['id']}"):
                            toggle_todo(todo['id'])
                            st.rerun()

                    with col5:
                        if st.button("🗑️", key=f"delete_{todo['id']}"):
                            remove_todo(todo['id'])
                            st.rerun()

            if completed_todos:
                st.markdown("#### Elvégzett teendők")
                for todo in completed_todos:
                    col1, col2, col3, col4 = st.columns([3, 2, 2, 2])

                    with col1:
                        st.markdown(f'<p class="completed-item">{todo["name"]}</p>', unsafe_allow_html=True)

                    with col2:
                        st.text(todo['category'])

                    with col3:
                        st.text("✅ Elvégezve")

                    with col4:
                        if st.button("↺", key=f"undo_{todo['id']}"):
                            toggle_todo(todo['id'])
                            st.rerun()
        else:
            st.info("Még nincsenek teendőid. Adj hozzá egyet!")

if __name__ == "__main__":
    main()
